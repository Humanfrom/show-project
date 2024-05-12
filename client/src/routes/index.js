import React from 'react';
import General from '@Pages/General.jsx'
import Boxes from '@Pages/Boxes.jsx'
import Info from '@Pages/Info.jsx'
import Personal from '@Pages/Personal.jsx'
import Payment from '@Pages/Payment.jsx'
import Cart from '@Pages/Cart.jsx'
import Error from '@Pages/Error.jsx'
import Login from '@Pages/Login.jsx'
import Admin from '@Pages/Admin.jsx'
import Registration from '@Pages/Registration.jsx'
import Confirm from '@Pages/Confirm';
import Recover from '@Pages/Recover';
import Delivery from '@Pages/Delivery';

export const adminRoutes = [
    {path: '/', component: General, name: 'Главная', replace: true, id: "general"},
    {path: '/boxes', component: Boxes, name: 'Выбрать набор', replace: true, id: "boxes"},
    {path: '/info', component: Info, name: 'Помощь', replace: true, id: "info"},
    {path: '/payment', component: Payment, name: 'Оплата', replace: true, id: "payment"},
    {path: '/personal', component: Personal, name: 'Мои подписки', replace: true, id: "Personal"},
    {path: '/admin', component: Admin, name: 'Админ', replace: true, id: "admin"},
    {path: '/*', component: Error, name: 'Ошибка', replace: true, id: "error"}
]

export const privateRoutes = [
    {path: '/', component: General, name: 'Главная', replace: true, id: "general"},
    {path: '/boxes', component: Boxes, name: 'Выбрать набор', replace: true, id: "boxes"},
    {path: '/info', component: Info, name: 'Помощь', replace: true, id: "info"},
    {path: '/payment', component: Payment, name: 'Оплата', replace: true, id: "payment"},
    {path: '/personal', component: Personal, name: 'Мои подписки', replace: true, id: "Personal"},
    {path: '/cart', component: Cart, name: 'Корзина', replace: true, id: "cart"},
    {path: '/*', component: Error, name: 'Ошибка', replace: true, id: "error"},
    {path: '/delivery', component: Delivery, name: 'Доставка', replace: true, id: "delivery"},
]


export const publicRoutes = [
    {path: '/', component: General, name: 'Главная', replace: true, id: "general"},
    {path: '/boxes', component: Boxes, name: 'Выбрать набор', replace: true, id: "box"},
    {path: '/info', component: Info, name: 'Помощь', replace: true, id: "info"},
    {path: '/payment', component: Payment, name: 'Оплата', replace: true, id: "payment"},
    {path: '/delivery', component: Delivery, name: 'Доставка', replace: true, id: "delivery"},
    {path: '/cart', component: Cart, name: 'Корзина', replace: true, id: "cart"},
    {path: '/login', component: Login, name: 'Войти', replace: true},
    {path: '/registration', component: Registration, name: 'Регистрация', replace: true},
    {path: '/confirm', component: Confirm, name: 'Подтверждение', replace: true},
    {path: '/recover', component: Recover, name: 'Восстановление', replace: true},
    {path: '/*', component: Error, name: 'Ошибка', replace: true}
]
