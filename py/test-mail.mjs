import { createTransport } from 'nodemailer';

const transporter = createTransport({
    host: '127.0.0.1', // ホスト名
    port: 8025,
    secure: false,
    //   auth: {
    //     user: mail@example.com, // メールアドレス
    //     pass: ******** // パスワード
    //   }
});

try {
    await transporter.sendMail({
        from: `"Shinobi Works" <no-reply@example.com>`,
        to: `administer@example.com`,
        subject: '問い合わせがありました',
        text: `サイトにお問い合わせがありました...（略）`,
    });
} catch (error) {
    console.log(`メールを送信できませんでした`);
    throw error;
}
