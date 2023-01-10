import {Link, useParams} from "react-router-dom";
import {getApiRequest} from "../../../api/requests/getApiRequest";
import {URL_SURVEY} from "../../../api/apiConst";
import s from "./SurveyReadonly.module.scss";
import {Box, Modal, Slider} from "@mui/material";
import {useEffect, useState} from "react";
import QRCode from "react-qr-code";


const MARKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(elem => {
    return {value: elem, label: `${elem}`}
});

export default function SurveyReadonly() {
    const [survey, setSurvey] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [isLoader, setLoader] = useState(false)

    const {id} = useParams()
    const url = window.location.href;

    useEffect(() => {
        setLoader(true)
        getApiRequest(`${URL_SURVEY}?id=${id}`)
            .then(res => {
                setSurvey(res)
                setLoader(false)
            })

    }, [id])

    const handleBlueBtnClick = () => {
        setOpenModal(true)
    }

    return (
        <div className={s.survey_page_container}>
            {isLoader
                ? <div style={{fontSize: 22, margin: 40}}>Загрузка...</div>
                : <div className={s.survey_title}>
                    <h1>
                        {survey.name}
                    </h1>
                    <span/>
                    <div className={s.buttons}>
                        <Link to={"/stakeholder/surveys"}>
                            <button className={s.closeBtn}>
                                Закрыть
                            </button>
                        </Link>

                        <button className={s.blueBtn} onClick={handleBlueBtnClick}>
                            Поделиться
                        </button>
                    </div>
                </div>
            }

            {survey.criteria && survey.criteria.map((criteria, index) => (
                    <div className={s.question} key={index}>
                        <label>
                            {index + 1}. {criteria.desc}
                        </label>
                        <Slider
                            sx={{'& .MuiSlider-thumb': {color: '#597EF7'}}}
                            className={s.slider}
                            track={false}
                            step={1}
                            min={1}
                            max={10}
                            marks={MARKS}
                            disabled
                        />
                    </div>
                )
            )}

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Box className={s.modal}>
                    <div className={s.content}>
                        <h2>Поделитесь ссылкой на опрос</h2>
                        <div>URL: <span className={s.ref}>  {url}</span></div>
                        <QRCode value={url} className={s.qr}/>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}
