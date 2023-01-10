import {NavLink} from "react-router-dom";
import {useState} from "react";

import s from "./Header.module.scss";
import {useCookies} from "react-cookie";


export default function Header() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [cookies] = useCookies();

    const userName = cookies.userName;


    const linksAdmin = [
        {name: 'Опросы', linkSrc: '/stakeholder/surveys'},
        {name: 'Муниципалитеты', linkSrc: '/stakeholder/municipalities'},
        {name: 'Результаты', linkSrc: '/stakeholder/results'},
        {name: 'Карта', linkSrc: '/stakeholder/map'},
        {name: 'Управление', linkSrc: '/stakeholder/manage'},
        {name: 'Личный кабинет', linkSrc: '/profile'},
        {name: userName, linkSrc: '/login'},
    ]

    const linksStakeholder = [
        {name: 'Опросы', linkSrc: '/stakeholder/surveys'},
        {name: 'Муниципалитеты', linkSrc: '/stakeholder/municipalities'},
        {name: 'Результаты', linkSrc: '/stakeholder/results'},
        {name: 'Карта', linkSrc: '/stakeholder/map'},
        {name: 'Личный кабинет', linkSrc: '/profile'},
        {name: userName, linkSrc: '/login'},
    ]

    const linksUser = [
        {name: 'Опросы', linkSrc: '/surveys'},
        {name: 'Личный кабинет', linkSrc: '/profile'},
        {name: userName, linkSrc: '/login'},
        // {name: 'Войти / Зарегистрироваться', linkSrc: '/login'},
    ]

    let links = []
    const userRoles = cookies.userRole;

    if (userRoles[0] >= 1 && userRoles[0] <= 4) {

        links = linksUser
    } else if (userRoles[0] == 5) {
        links = linksStakeholder
    } else {
        links = linksAdmin
    }

    const handleClickLink = (index) => {
        setActiveIndex(index)
    }

    return (
        <header className={s.header}>
            <div className={s.header_logo}>
                <NavLink to={'/'}><img src={require('../../images/logo.png')} className={s.logo} alt=""/></NavLink>
            </div>
            <div className={s.navbar}>
                <ul>
                    {links && links.map((link, index) => (
                        <li key={index}>
                            <NavLink className={`${s.navlink} ${activeIndex === index ? s.selected : ''}`}
                                     to={link.linkSrc}
                                     onClick={() => handleClickLink(index)}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}

                </ul>
            </div>
        </header>
    )
}
