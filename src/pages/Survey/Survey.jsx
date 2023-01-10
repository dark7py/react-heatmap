import s from './Survey.module.scss'
import {Button, Slider} from "@mui/material";
import {useEffect, useState} from "react";
import SurveyForm from "../../components/Survey/SurveyForm";
import {useParams} from "react-router-dom";
import {getApiRequest} from "../../api/requests/getApiRequest";
import {URL_SURVEY} from "../../api/apiConst";


export default function Survey(props){
    const [survey, setSurvey] = useState({})
    const {id}=useParams()
    console.log(id);

    useEffect(() => {
        getApiRequest(`${URL_SURVEY}?id=${id}`).then(res => setSurvey(res))

    }, [])

    return(
        <div className={s.survey_page_container}>
            <div className={s.survey_title}>
                <h1>
                    {survey.name}
                </h1>
                <span></span>
            </div>
            <SurveyForm criterias={survey.criteria} />
        </div>
    )
}
