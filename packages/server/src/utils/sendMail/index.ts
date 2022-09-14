import { createTransport } from "nodemailer";
import { getMailHTML } from "./getMailHTML";
const { EMAIL, EMAIL_SECRET } = process.env;

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

export async function sendVerifyCodeMail(to: string) {
    const randomCode = Math.random().toString(36).slice(2, 8).toUpperCase(); // 生成六位随机数字字母
    const endTimeDate = new Date(Date.now() + 10 * 60 * 1000);
    let seconds = endTimeDate.getSeconds().toString();
    if (seconds.length <= 1) {
        seconds = "0" + seconds;
    }
    // prettier-ignore
    const endTime = `${endTimeDate.getFullYear()}/${endTimeDate.getMonth() + 1}/${endTimeDate.getDate()} ${endTimeDate.getHours()}:${endTimeDate.getMinutes()}:${seconds}`;

    const mailOptions = {
        from: EMAIL, // 发件人地址
        to, // 收件人地址，多个收件人可以使用逗号分隔
        subject: "验证码", // 邮件标题
        html: await getMailHTML("verifycode", { randomCode, endTime }), // 邮件内容
    };
    const result = await transporter.sendMail(mailOptions);
    if (!result) {
        throw "邮箱发送失败";
    }
    return randomCode;
}
