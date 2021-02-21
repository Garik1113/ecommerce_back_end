import { Attribute, AttributeValue, Image, TProduct, TAttributeData } from '../types/product';

const makeImageReadyForDb = (images: string[] = []):Image[] => {
    return images.map((image) => {
        return {
            thumbnail_image: image,
            small_image: image,
            main_image: image
        }
    })
}

const makeAttributeReadyForDb = (attributes: any[] = []): Attribute[] => {
    return attributes.map((attr) => {
        return {
            id: attr.id,
            label: attr.label,
            values: attr.values.map((val: any) => {
                return {
                    id: val.id,
                    label: val.label,
                    images: makeImageReadyForDb(val.images)
                }
            })
        }
    })
}

 export const convertProductObjectToDbFormat = (productObj: any):TProduct => {
    const product: TProduct = {
        name: productObj.name || "",
        pageTitle: productObj.pageTitle || "",
        description: productObj.description || "",
        metaDescription: productObj.metaDescription,
        attributes: makeAttributeReadyForDb(productObj.attributes) || [],
        price: productObj.price || {},
        discount: productObj.discount || {},
        averageRating: productObj.averageRating || 1,
        categories: productObj.categories || [],
        images: makeImageReadyForDb(productObj.images) || []
    }
    return product;
}

export const convertDbProductToNormal = (productDb: any):TProduct => {
    const product: TProduct = {
        _id: productDb._id,
        name: productDb.name || "",
        pageTitle: productDb.pageTitle || "",
        description: productDb.description || "",
        metaDescription: productDb.metaDescription || "",
        attributes: productDb.attributes || [],
        price: productDb.price || {},
        discount: productDb.discount || {},
        averageRating: productDb.averageRating || 1,
        categories: productDb.categories || [],
        images: productDb.images || []
    }
    return product;
}

export const getMatchingVariantsOfAttribute = (attributeData: TAttributeData[], product: TProduct): Attribute[] => {
    const { attributes } = product;
    const newAttributes: Attribute[] = attributeData.reduce((state: Attribute[], current:TAttributeData):Attribute[] => {
        const currentAttr: Attribute | undefined = attributes.find(e => e.id == current.attributeId);
        if (currentAttr) {
           const filteredValueArr: AttributeValue[] = currentAttr.values.filter(val => val.id == current.valueId);
           currentAttr.values = filteredValueArr;
           state.push(currentAttr);
        }
        return state;
    }, []);
    return newAttributes;
}