import AttributeDb from '../collections/attribute';
import { asyncForEach } from '../helpers/asyncForEach';
import { Image, IProduct, IConfigurableAttribute } from '../interfaces/product';
import { convertDbAttributeToNormal } from './attribute';



const makeImageReadyForDb = (images: string[] = []):Image[] => {
    return images.map((image: any) => {
        return {
            thumbnail_image:  typeof image == "object" ? image.thumbnail_image : image,
            small_image: typeof image == "object" ? image.small_image : image,
            main_image: typeof image == "object" ? image.main_image : image,
        }
    })
}

export const convertProductObjectToDbFormat = async (productObj: any = {}): Promise<any> => {
    const attributeFacets: string[] = [];
    const filters:any = {};
    if (productObj.configurableAttributes && productObj.configurableAttributes.length) {
        // productObj.configurableAttributes.map((e: any)=> {
        //     attributeFacets.push(typeof e.value == "object" ? e.value.id : e.value)
        // })
        await asyncForEach(productObj.configurableAttributes, async(attr:IConfigurableAttribute) => {
            const { attribute, value } = attr;
            const attributeDb = await AttributeDb.getAttributeById(String(attribute));
            if (attributeDb) {
                const attrubuteResult = convertDbAttributeToNormal(attributeDb);
                filters[attrubuteResult.code] = value 
            }
        })
    }
    
    const product: any = {
        name: productObj.name || "",
        pageTitle: productObj.pageTitle || "",
        description: productObj.description,
        metaDescription: productObj.metaDescription,
        price: productObj.price || 0,
        discountedPrice: productObj.discountedPrice || 0,
        discount: productObj.discount || 0,
        defaultPrice: productObj.discountedPrice || productObj.price,
        averageRating: productObj.averageRating || 1,
        categories: productObj.categories || [],
        images: makeImageReadyForDb(productObj.images) || [],
        quantity: productObj.quantity || 0,
        configurableAttributes: productObj.configurableAttributes,
        currency: productObj.currency,
        attributeFacets,
        filters
    }
    return product;
}

type PrepareProductParams = {
    withAttributeData: boolean
}

export const prepareProductData = async (productDb: any={}, params: PrepareProductParams):Promise<IProduct> => {
    const { withAttributeData = false } = params;
    const { configurableAttributes } = productDb;
    const newConfigurableAttributes:IConfigurableAttribute[] = [];
    if (withAttributeData && configurableAttributes && configurableAttributes.length) {
        await asyncForEach(configurableAttributes, async(confAttribute: IConfigurableAttribute) => {
            const { attribute, value } = confAttribute;
            const attributeDb = await AttributeDb.getAttributeById(String(attribute));
            if (attributeDb) {
                const findedAttribute = convertDbAttributeToNormal(attributeDb);
                const findedValue = findedAttribute.values.find(v => v.id == value);
                if (findedValue) {
                    newConfigurableAttributes.push({
                        attribute: findedAttribute,
                        value: findedValue,
                    })
                }
            }
        })
    }
    const product: IProduct = {
        _id: productDb._id,
        name: productDb.name || "",
        discountedPrice: productDb.discountedPrice,
        pageTitle: productDb.pageTitle || "",
        description: productDb.description || "",
        metaDescription: productDb.metaDescription || "",
        price: productDb.price || 0,
        discount: productDb.discount || 0,
        defaultPrice: productDb.defaultPrice || 0,
        averageRating: productDb.averageRating || 1,
        categories: productDb.categories || [],
        images: productDb.images || [],
        quantity: productDb.quantity || 0,
        configurableAttributes: newConfigurableAttributes.length ? newConfigurableAttributes :  productDb.configurableAttributes,
        currency: productDb.currency
    }
    return product;
}

export const getTotalPriceOfProduct = (product: IProduct, quantity: number): number => {
    return product.discountedPrice ? product.discountedPrice * quantity : product.price * quantity
}
