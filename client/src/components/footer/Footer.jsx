import React from 'react';
//import './Navbar.css';
import { useNavigate, useLocation } from "react-router-dom";
import { adminRoutes, privateRoutes, publicRoutes } from '../../routes';
import { useSelector } from 'react-redux';

const Footer = () => {

    return (
        <footer id="footer">

            <div className="footer-top">
                <div className="container">
                    <div className="row">

                        <div className="col-lg-3 col-md-6 footer-contact">
                            <div className="logo">
                                <a onClick={() => {}}>
                                    <img src="assets/img/logo.png" alt=""/>
                                </a>
                                <h3 className='footer-title mt-3'>Navi-Li</h3>
                            </div>
                            
                        </div>

                        <div className="col-lg-2 col-md-6 footer-links">
                            <h4>Перейти</h4>
                            <ul>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Главная</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Выбрать набор</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Доставка и оплата</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Личный кабинет</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Помощь</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-6 footer-links">
                            <h4>Вас может заинтересовать</h4>
                            <ul>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Сотрудничество</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Наши партнёры</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Вакансии</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">О проекте</a></li>
                            <li><i className="bx bx-chevron-right"></i> <a href="#">Уголок потребителя</a></li>
                            </ul>
                        </div>

                        <div className="col-lg-4 col-md-6 footer-newsletter">
                            <h4>Подпишитесь на нас</h4>
                            <div className="hero-icons d-inline-flex mt-4">
                                <div className="hero-icon"><a href="#" className="instagram"><i className="bx bxl-instagram"></i></a><div className="hexagon-solid" /></div>
                                <div className="hero-icon"><a href="#" className="instagram"><i className="bx bxl-instagram"></i></a><div className="hexagon-solid" /></div>
                                <div className="hero-icon"><a href="#" className="instagram"><i className="bx bxl-instagram"></i></a><div className="hexagon-solid" /></div>
                                <div className="hero-icon"><a href="#" className="instagram"><i className="bx bxl-instagram"></i></a><div className="hexagon-solid" /></div>
                            </div>
                            <p className='mt-4'>
                            Мы тщательно следим за нашими соцсетями. Там Вы сможете найти самую актуальную информацию по поддержке и нашим продуктам.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        <div className="container d-md-flex py-4">
            <div className="me-md-auto text-center text-md-start">
                <div className="copyright">
                &copy; Все права защищены. Информация актуальна на февраль 2024. Правовая публичная информация доступна по <a href="/#">ссылке</a> 
                </div>
                <div className="credits"></div>
            </div>
        </div>
    </footer>
    );
};

export default Footer;