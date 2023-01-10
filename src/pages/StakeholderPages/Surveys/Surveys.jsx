import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import FilterButton from "../../../components/SurveyCatalog/FilterButton";
import SurveyItem from "../../../components/SurveyCatalog/SurveyItem";
import {Button, IconButton, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import s from "./Surveys.module.scss";
import {getApiRequest} from "../../../api/requests/getApiRequest";
import {URL_SURVEYS} from "../../../api/apiConst";


function Surveys() {
    const [surveys, setSurveys] = useState([]);
    const [filters, setFilters] = useState({
        region: '',
        city: '',
        school: '',

    });

    useEffect(() => {
        getApiRequest(URL_SURVEYS).then(res => setSurveys(res))
    }, [])

    const filtersOnChange = (e) => {
        setFilters({...filters, [e.target.name]: e.target.value})
    }

    const handleAddButton = (e) => {

    }

    return (
        <div className={s.survey_catalog_container}>
            <div className={s.page_title}>
                <h1>Здесь находятся все созданные вами опросы</h1>

                <Link to={'new'} style={{textDecoration: 'none'}}>
                    <Button
                        className={s.buttonAdd}
                        variant={'outlined'}
                        onClick={handleAddButton}
                    >
                        <AddIcon style={{fontSize: "20px", marginRight: "5px"}}/>
                        Добавить опрос
                    </Button>
                </Link>
            </div>
            <div className={s.survey_filters}>


                <TextField
                    className={s.search_form}
                    onChange={filtersOnChange}
                    id="searchFilter"
                    size='small'
                    name='searchFilter'
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            paddingRight: 0,
                        },
                        '& .MuiIconButton-root': {
                            color: 'white',
                            borderTopRightRadius: '5px',
                            borderBottomRightRadius: '5px'
                        },
                    }
                    }
                    label="Введите тему вопроса"
                    InputProps={{
                        endAdornment: (
                            <IconButton sx={{background: '#1890FF', borderRadius: 0,}}>
                                <SearchIcon/>
                            </IconButton>
                        ),
                    }}
                />
                <FilterButton
                    text={'Преподавание'}
                />
                <FilterButton
                    text={'Бытовые'}
                />
                <FilterButton
                    text={'Социальные'}
                />

            </div>
            <div className={s.survey_catalog}>
                <div className={s.survey_catalog_list}>
                    <h2 className={s.survey_for}>Для родителей:</h2>
                    <div className={s.surveys}>
                        {
                            surveys.map(survey => (
                                <SurveyItem key={survey.id} id={survey.id} theme={survey.name}
                                            text={"Оцените " + survey.name} count={survey.criteria.length}
                                            isStakeholder={true}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Surveys;
