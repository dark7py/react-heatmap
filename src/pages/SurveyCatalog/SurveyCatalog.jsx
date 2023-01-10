import {useEffect, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import FilterSelect from "../../components/SurveyCatalog/FilterSelect";
import FilterButton from "../../components/SurveyCatalog/FilterButton";
import SurveyItem from "../../components/SurveyCatalog/SurveyItem";

import {getApiRequest} from "../../api/requests/getApiRequest";
import {URL_SURVEYS} from "../../api/apiConst";

import s from './SurveyCatalog.module.scss'


export default function SurveyCatalog() {
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

    return (
        <div className={s.survey_catalog_container}>
            <div className={s.page_title}>
                <h1>Проходите опросы для улучшения работы образовательной системы</h1>
            </div>
            <div className={s.survey_filters}>

                <FilterSelect value={filters.region}
                              onChange={filtersOnChange}
                              name={'region'}
                              label={'Регион'}
                              values={['Свердловская область', 'Челябинская область']}

                />

                <FilterSelect value={filters.city}
                              onChange={filtersOnChange}
                              name={'city'}
                              label={'Город'}
                              values={['Екатеринбург', 'Ню йорк', 'Казахстан']}
                />

                <FilterSelect value={filters.school}
                              onChange={filtersOnChange}
                              name={'school'}
                              label={'Школа'}
                              values={['1', 'Лицей 14', 'Маоу Сош 25']}
                />


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
                            surveys.map(elem => (
                                <SurveyItem id={elem.id}
                                            key={elem.id}
                                            theme={elem.name}
                                            text={"Оцените " + elem.name}
                                            count={elem.criteria.length}
                                            isStakeholder={false}
                                />
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}
