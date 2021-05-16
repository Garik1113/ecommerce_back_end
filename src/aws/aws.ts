const Aws = require('aws-sdk');
const config = require('config');

type Params = {
    to: string,
    content: string,
    subject: string
}

export const sendEmail = async (sesParams: Params) => {
    const { to, content, subject } = sesParams;
    const ses = new Aws.SES({
        region: config.get("aws").REGION,
        credentials: {
            accessKeyId : config.get("aws").ACCESS_KEY_ID,
            secretAccessKey: config.get("aws").SECRET_ACCES_KEY
        } 
    })
    const params = {
        Destination: {
            ToAddresses: [
                to
            ]
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8", 
                    Data: content
                }
            },
            Subject: {
                Charset: "UTF-8", 
                Data: subject
            }
        },
        Source: "Gariktsaturyan97@gmail.com"
    };
    const result = await ses.sendEmail(params).promise();
    console.log("result", result)
}


export const verifyEmail = async(email: string) => {
    await new Aws.SES({
        apiVersion: '2010-12-01', 
        region: config.get("aws").REGION,
        credentials: {
            accessKeyId : config.get("aws").ACCESS_KEY_ID,
            secretAccessKey: config.get("aws").SECRET_ACCES_KEY
        } 
    }).verifyEmailIdentity({EmailAddress: email}).promise();
}