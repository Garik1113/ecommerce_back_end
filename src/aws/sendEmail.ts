const Aws = require('aws-sdk');
//Setting region
Aws.config.update({region: "eu-west-1"});
const config = require('config');

type Params = {
    to: string,
    content: string,
    subject: string
}

export const sendEmail = async (sesParams: Params) => {
    const { to, content, subject } = sesParams;
    const ses = new Aws.SES({
        region: "eu-west-1",
        credentials: {
            accessKeyId : "AKIA3ESF6HUHSZII7EE2",
            secretAccessKey: "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"
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
    const result = await new Aws.SES({apiVersion: '2010-12-01'}).verifyEmailIdentity({EmailAddress: email}).promise();
    console.log("Result", result)
}