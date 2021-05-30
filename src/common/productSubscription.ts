import { IProductSubscriptionInput, IProductSubscription } from "../interfaces/productSubscription";
import cron from 'node-cron';
import Productsubscriptions from '../collections/productsubscriptions';
import { Document } from "mongoose";
import { IProduct } from '../interfaces/product';
import { asyncForEach } from '../helpers/asyncForEach';
import { sendEmail } from '../aws/aws';

export const convertProductSubscriptionObjectToDb = (obj: any = {}):IProductSubscriptionInput => {
    return {
        productId: obj.productId,
        customerId: obj.customerId
    }
}

export const convertDbProductSubscriptionToNormal = (dbObj: any = {}):IProductSubscription=> {
    return {
        _id: dbObj._id,
        productId: dbObj.productId,
        customerId: dbObj.customerId
    }
}

const prepareDataForEmail = (productSubscribers: IProductSubscription[] = []):any[] => {
    return productSubscribers.map(e => {
        if (e.customerId && typeof e.customerId == "object" && e.productId) {
            const { email } = e.customerId;
            const { quantity, name, _id } = e.productId as IProduct;
            if (Number(quantity) > 0) {
                return {
                    email,
                    quantity,
                    productName: name,
                    productId: _id,
                    id: e._id,
                }   
            }
        }
    })
}

const sendEmailsToProductSubscribers = async(preparedData: any[] = []):Promise<void> => {
    await asyncForEach(preparedData, async(data:any) => {
        await sendEmail({
            to: data.email,
            subject: "Product Now in stock",
            content: `${data.productName}ը արդեն հասանելի է, դուք կարող եք տեսնել այն այցելելով http://localhost:3000/product/${data.productId}`
        });
        await Productsubscriptions.deleteProductSubscription(data.id)
    })
}

const sendNotificationsToProductSubscribers = async() => {
    const productSubscribersResult: Document[] = await Productsubscriptions.getProductSubscriptions();
    const productSubscribers = productSubscribersResult.map(convertDbProductSubscriptionToNormal);
    const preparedData = prepareDataForEmail(productSubscribers);
    await sendEmailsToProductSubscribers(preparedData.filter(e => !!e));
} 

cron.schedule(`*/1 * * * *`, async () => {
    await sendNotificationsToProductSubscribers();
});