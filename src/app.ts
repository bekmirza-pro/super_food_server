import express, { Request, Response, text } from 'express'
import cors from 'cors'
import http from 'http'
import routes from './routes/index'
import { expressLogger } from './config/logger'
import { ErrorController } from './controllers/error'
import { langMiddleware } from './middleware/lang'

// Telegram bot
const TelegramBot = require('node-telegram-bot-api')

const botToken = '6678145484:AAGn5whjQkiRrKa6VeV8ZILqAtPuODKZQN4'
const bot = new TelegramBot(botToken, { polling: true })

import Food from './models/Food'
import Orders from './models/Orders'
import User from './models/User'

bot.onText(/\/start/, async (msg: any) => {
    const receiver = msg.chat.id

    bot.sendMessage(
        receiver,
        `Assalomu aleykum ${msg.from.first_name}, Nurqandning rasmiy botiga xush kelibsiz !!`,
        {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: '🥐 Shirinlik turlari'
                        },
                        {
                            text: '👥 Biz haqimizda'
                        }
                    ],
                    [
                        {
                            text: '📞 Aloqa'
                        }
                    ]
                ],
                resize_keyboard: true
            }
        }
    )
})

bot.on('message', async (msg: any) => {
    const receiver = msg.chat.id

    const foods = await Food.find({})

    const foodButtons = foods.map((food) => ({
        text: food.name,
        callback_data: `${food._id}`
    }))

    const keyboard = {
        reply_markup: {
            inline_keyboard: [foodButtons]
        }
    }

    if (msg.text === '🥐 Shirinlik turlari') {
        bot.sendMessage(receiver, 'Shirinlik turlari', keyboard)
    }

    if (msg.text === '📞 Aloqa') {
        bot.sendMessage(
            receiver,
            'Biz bilan bog`lanish uchun ushbu ishonch telefonlaridan foydalanishingiz mumkin:\n\nTell: +998(90) 475 11 22\n         +998(90) 465 11 22',
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: '⬅️ Orqaga ➡️'
                            }
                        ]
                    ],
                    resize_keyboard: true
                }
            }
        )
    }

    if (msg.text === '👥 Biz haqimizda') {
        bot.sendMessage(
            receiver,
            'Biz bilan bog`lanish uchun ushbu ishonch telefonlaridan foydalanishingiz mumkin:\n\nTell: +998(90) 475 11 22\n        +998(90) 465 11 22',
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: '⬅️ Orqaga ➡️'
                            }
                        ]
                    ],
                    resize_keyboard: true
                }
            }
        )
    }

    if (msg.text === '⬅️ Orqaga ➡️') {
        bot.sendMessage(receiver, '✅ Asosiy menyuga qaytdingiz !!!', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: '🥐 Shirinlik turlari'
                        },
                        {
                            text: '👥 Biz haqimizda'
                        }
                    ],
                    [
                        {
                            text: '📞 Aloqa'
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }

    if (msg.text === '⬅️ Shirinliklar ➡️') {
        bot.sendMessage(receiver, '✅Shirinliklar menusiga qaytdingiz !!!', keyboard)
    }
})

bot.on('callback_query', async (query: any) => {
    const chatId = query.from.id

    const _id = query.data

    const foodData = await Food.findById({ _id: _id })

    // console.log(`http://localhost:3000/api/api/file/${foodData[0].images[0]}`);
    // https://pro.zirapcha.uz/api/api/file/${foodData?.images[0]}

    if (foodData) {
        bot.sendPhoto(chatId, `https://pro.zirapcha.uz/api/api/file/${foodData?.images[0]}`, {
            caption: `Nomi: ${foodData.name}\nTa'rif: ${foodData.description}\nNarxi: ${foodData.price}`,
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Sonini belgilash:'
                        }
                    ],
                    [
                        {
                            text: '⬅️ Orqaga ➡️'
                        }
                    ]
                ],
                one_time_keyboard: true
            }
        })

        let replyListenerId: any = null

        let messageSent = false

        bot.onText(/Sonini belgilash:/, async (msg: any) => {
            let number: any;
        
            if (replyListenerId !== null) {
                bot.removeReplyListener(replyListenerId);
                replyListenerId = null; // Reset the listener ID variable
            }
        
            if (!messageSent) {
                let isInvalidInput = false;
        
                // Function to handle the "Enter Number" step
                const handleEnterNumberStep = () => {
                    bot.sendMessage(msg.chat.id, 'Nechta buyurtirishni istaysiz:', {
                        reply_markup: {
                            force_reply: true,
                            selective: true
                        }
                    }).then((payload: any) => {
                        replyListenerId = bot.onReplyToMessage(
                            payload.chat.id,
                            payload.message_id,
                            (msg: any) => {
                                number = msg.text;
        
                                if (!isNaN(number)) {
                                    // It's a valid number, move to the next step
                                    isInvalidInput = false;
                                    handleEnterPhoneNumberStep();
                                } else {
                                    // Invalid input, not a number
                                    isInvalidInput = true;
                                    handleEnterNumberStep(); // Prompt again for a valid number
                                }
        
                                bot.removeReplyListener(replyListenerId);
                                replyListenerId = null;
                            }
                        );
                    });
                };
        
                // Function to handle the "Enter Phone Number" step
                const handleEnterPhoneNumberStep = () => {
                    bot.sendMessage(
                        chatId,
                        'Raqamingizni namunadagidek yuboring: 998339908007',
                        {
                            reply_markup: {
                                force_reply: true,
                                selective: true
                            }
                        }
                    ).then((payload: any) => {
                        replyListenerId = bot.onReplyToMessage(
                            payload.chat.id,
                            payload.message_id,
                            async (msg: any) => {
                                bot.removeReplyListener(replyListenerId);
                                replyListenerId = null;
        
                                if (!isNaN(msg.text)) {
                                    const phone_number = parseFloat(msg.text);
        
                                    let user = await User.find({
                                        phone_number: phone_number
                                    });
        
                                    if (user.length == 0) {
                                        let userNew = await User.create({
                                            name: `${msg.from.first_name}`,
                                            username: msg.from.username,
                                            phone_number: phone_number
                                        });
        
                                        let order = await Orders.create({
                                            user_id: userNew._id,
                                            food_id: foodData._id,
                                            number: number
                                        });
                                    } else {
                                        let order = await Orders.create({
                                            user_id: user[0]._id,
                                            food_id: foodData._id,
                                            number: number
                                        });
                                    }
        
                                    bot.sendMessage(
                                        chatId,
                                        'Sizning buyurtmangiz qabul qilindi, yaqin orada aloqaga chiqamiz 😊😊😊 !!',
                                        {
                                            reply_markup: {
                                                keyboard: [
                                                    [
                                                        {
                                                            text: '⬅️ Shirinliklar ➡️'
                                                        }
                                                    ],
                                                    [
                                                        {
                                                            text: '⬅️ Orqaga ➡️'
                                                        }
                                                    ]
                                                ],
                                                resize_keyboard: true
                                            }
                                        }
                                    );
        
                                    bot.removeReplyListener(replyListenerId);
                                    replyListenerId = null;
                                } else {
                                    // Invalid input for the phone number, prompt again
                                    handleEnterPhoneNumberStep();
                                }
                            }
                        );
                    });
                };
        
                // Start with the "Enter Number" step
                handleEnterNumberStep();
        
                messageSent = true;
            }
        });
    }
})

// Telegram bot

const app = express()
let server = http.createServer(app)

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(expressLogger())
app.use(langMiddleware)

app.use('/api', routes)

app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: 'OK'
    })
})

const errorController = new ErrorController()
app.use(errorController.handle)

export default server
