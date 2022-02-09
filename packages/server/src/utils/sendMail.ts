import { createTransport } from "nodemailer";
const email = process.env.email!;

const transporter = createTransport({
    // @ts-ignore
    host: "smtp.163.com", // 网易的邮件地址
    port: 465, // 端口
    secureConnection: false, // use SSL
    auth: {
        user: email, // 邮箱账号
        pass: "DFJMNLDKEVBJGCNN", // 邮箱的授权码
    },
});

export default async function (mail: string) {
    const randomCode = Math.random().toString(36).slice(2, 8); // 生成六位随机数字字母

    const mailOptions = {
        from: email, // 发件人地址
        to: mail, // 收件人地址，多个收件人可以使用逗号分隔
        subject: "注册验证", // 邮件标题
        html: `<p>欢迎注册我的博客，验证码十分钟内有效，你应该不会告诉别人吧</p><p>${randomCode}</p>`, // 邮件内容
    };
    const result = await transporter.sendMail(mailOptions);
    if (!result) {
        throw "邮箱发送失败";
    }
    return randomCode;
}
