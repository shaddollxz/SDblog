import { createTransport } from "nodemailer";
const { EMAIL, EMAIL_SECRET } = process.env;
import getMailHTML from "./getMailHTML";

const transporter = createTransport({
    // @ts-ignore
    host: "smtp.163.com", // 网易的邮件地址
    port: 465, // 端口
    secureConnection: false, // use SSL
    auth: {
        user: EMAIL, // 邮箱账号
        pass: EMAIL_SECRET, // 邮箱的授权码
    },
});

export default async function (mail: string) {
    const randomCode = Math.random().toString(36).slice(2, 8); // 生成六位随机数字字母

    const mailOptions = {
        from: EMAIL, // 发件人地址
        to: mail, // 收件人地址，多个收件人可以使用逗号分隔
        subject: "注册验证", // 邮件标题
        html: await getMailHTML({ randomCode }), // 邮件内容
    };
    const result = await transporter.sendMail(mailOptions);
    if (!result) {
        throw "邮箱发送失败";
    }
    return randomCode;
}
