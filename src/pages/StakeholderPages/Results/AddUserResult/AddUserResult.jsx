import {useEffect, useState} from "react";
import {
    Autocomplete,
    Button,
    Modal,
    Step,
    StepConnector,
    stepConnectorClasses,
    StepLabel,
    Stepper,
    styled,
    TextField
} from "@mui/material";
import ModalWindow from "../../../../components/ModalWindow/ModalWindow";

import s from "./AddUserResult.module.scss";
import {URL_MAPOBJECTS, URL_RESULTS, URL_SURVEYS} from "../../../../api/apiConst";
import {getApiRequest} from "../../../../api/requests/getApiRequest";
import {postApiRequest} from "../../../../api/requests/postApiRequest";


const CustomConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#91D5FF',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#91D5FF',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        minHeight: 35
    },
}));

function AddUserResult() {
    const [activeStep, setActiveStep] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [loader, setLoader] = useState(false);

    const [resultState, setResultState] = useState({
        oblast: '',
        city: '',
        school: '',
        surveyTheme: '',
        surveyHeader: '',
        questionsResults: [],
        userID: '29'
    });
    console.log("STATE", resultState);
    const [cityOptions, setCityOptions] = useState({});
    const [schoolsOptions, setSchoolOptions] = useState([]);
    const [surveyOptions, setSurveyOptions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [criteriaArray, setCriteriaArray] = useState([]);

    useEffect(() => {
        getApiRequest(URL_MAPOBJECTS).then(res => res.data).then(arr => {
            let cities = []
            let schools = []
            arr.map((obj) => {
                if (!cities.includes(obj.city)) cities.push(obj.city);
                schools.push({label: obj.name, id: obj.id, city: obj.city});
            })
            setCityOptions({
                options: cities,
                getOptionLabel: city => city
            });
            setSchoolOptions(schools);
        })

        getApiRequest(URL_SURVEYS).then(res => {
            setSurveys(res);
            let surveysThemes = []
            res.map(obj => {
                surveysThemes.push({label: obj.name, id: obj.id});
            })

            setSurveyOptions(surveysThemes);
        })
    }, [])

    useEffect(() => {
        const schools = schoolsOptions.filter((item) => {
            if (item.city !== resultState.city) {
                return item
            }
        })
        setSchoolOptions(schools);
    }, [resultState.city])

    useEffect(() => {
        if (resultState.surveyTheme) {
            surveys.filter((item) => {
                if (item.name == resultState.surveyTheme.label) {
                    setCriteriaArray(item.criteria);
                }
            })
        } else {
            setCriteriaArray([])
        }

    }, [resultState.surveyTheme])

    const handleChangeInput = (value, editField, stepCount) => {
        setResultState({
            ...resultState,
            [editField]: value
        });
        setActiveStep(stepCount);
    }

    const handleSendBtnClick = async () => {
        setLoader(true);

        const data = {
            "object_id": resultState.school.id,
            "results": resultState.questionsResults,
            "survey_id": resultState.surveyTheme.id,
            "user_id": resultState.userID
        }

        await postApiRequest(URL_RESULTS, data).then(res => console.log(res))

        setOpenModal(true)
        setActiveStep(5)
        setLoader(false);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }


    return (
        <>
            <h1 className={s.header}>Внесите результаты опроса за другого пользователя</h1>
            <div className={s.container}>
                <div className={s.steps}>
                    <Stepper activeStep={activeStep} orientation={"vertical"} connector={<CustomConnector/>}>
                        <Step key={1} className={s.step}>
                            <StepLabel>
                                <div className={s.head}>
                                    Выбор местоположения
                                </div>
                                <div className={s.description}>
                                    Выберите область, город и школу
                                </div>
                            </StepLabel>
                        </Step>

                        <Step key={2} className={s.step}>
                            <StepLabel>
                                <div className={s.head}>
                                    Ввод данных пользователя
                                </div>
                                <div className={s.description}>
                                    Кто проходил данный опрос?
                                </div>
                            </StepLabel>
                        </Step>

                        <Step key={3} className={s.step}>
                            <StepLabel>
                                <div className={s.head}>
                                    Описание темы опроса
                                </div>
                                <div className={s.description}>
                                    Выберите свою тему
                                </div>
                            </StepLabel>
                        </Step>

                        <Step key={4} className={s.step}>
                            <StepLabel>
                                <div className={s.head}>
                                    Добавление ответов
                                </div>
                                <div className={s.description}>
                                    Введите результаты (число от 1 до 10)
                                </div>
                            </StepLabel>
                        </Step>

                        <Step key={5} className={s.step}>
                            <StepLabel>
                                <div className={s.head}>
                                    Публикация результатов
                                </div>
                                <div className={s.description}>
                                    Сделайти результаты доступными для статистики
                                </div>
                            </StepLabel>
                        </Step>

                    </Stepper>

                </div>

                <div className={s.block}>
                    <div className={s.blockItem}>
                        <Autocomplete
                            key={"oblast"}
                            name={"oblast"}
                            renderInput={(params => <TextField {...params} label={"Выберите область"}/>)}
                            options={["Свердловская"]}
                            sx={{width: 250, height: 32}}
                            size={"small"}
                            value={resultState.oblast}
                            onChange={(e, newValue) => handleChangeInput(newValue, "oblast", 0)}
                        />
                        <Autocomplete
                            key={"city"}
                            renderInput={(params => <TextField {...params} label={"Выберите город"}/>)}
                            {...cityOptions}
                            sx={{width: 250, height: 32}}
                            size={"small"}
                            // value={resultState.city}
                            onChange={(e, newValue) => handleChangeInput(newValue, "city", 0)}
                        />
                        <Autocomplete
                            key={"school"}
                            renderInput={(params => <TextField {...params} label={"Выберите муниципалитет"}/>)}
                            options={schoolsOptions}
                            sx={{width: 250, height: 32}}
                            size={"small"}
                            value={resultState.school}
                            onChange={(e, newValue) => handleChangeInput(newValue, "school", 1)}
                        />
                    </div>

                    <div className={s.blockItem}>
                        <TextField label={"Введите фио"}
                                   sx={{width: 250, height: 32}}
                                   size={"small"}
                                   name={"name"}
                        />
                    </div>

                    <div className={s.blockItem}>
                        <Autocomplete
                            key={"theme"}
                            renderInput={(params => <TextField {...params} label={"Тема опроса"}/>)}
                            options={surveyOptions}
                            sx={{width: 250, height: 32}}
                            size={"small"}
                            onChange={(e, newValue) => handleChangeInput(newValue, "surveyTheme", 2)}
                            // freesolo={true}
                        />
                        {/*<TextField label={"Введите заголовок опроса"}*/}
                        {/*           sx={{width: 250, height: 32}}*/}
                        {/*           size={"small"}*/}
                        {/*/>*/}
                    </div>


                    {/*<FormGroup className={s.checkboxes}>*/}
                    {/*    <FormControlLabel*/}
                    {/*        control={*/}
                    {/*            <Checkbox sx={{color: "#D9D9D9"}} onChange={handleChangeCheckbox} name={"родители"}/>}*/}
                    {/*        label={"Родители"}*/}
                    {/*    />*/}
                    {/*    <FormControlLabel*/}
                    {/*        control={*/}
                    {/*            <Checkbox sx={{color: "#D9D9D9"}} onChange={handleChangeCheckbox} name={"ученики"}/>}*/}
                    {/*        label={"Ученики"}*/}
                    {/*    />*/}
                    {/*    <FormControlLabel*/}
                    {/*        control={*/}
                    {/*            <Checkbox sx={{color: "#D9D9D9"}} onChange={handleChangeCheckbox} name={"работники"}/>}*/}
                    {/*        label={"Работники"}*/}
                    {/*    />*/}
                    {/*</FormGroup>*/}

                    {criteriaArray.map((criteria, index) => (
                        <div className={s.marks}>
                            <div className={s.desc}>
                                {index + 1 + ") " + criteria.desc}
                            </div>
                            <Autocomplete
                                className={s.input}
                                renderInput={(params => <TextField {...params} label={"Введите оценку"}/>)}
                                options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                                onChange={(e, newValue) => {
                                    const result = {criteria_id: criteria.id, score: newValue}
                                    setResultState({
                                        ...resultState,
                                        questionsResults: [
                                            ...resultState.questionsResults,
                                            result
                                        ]
                                    })
                                    setActiveStep(4);
                                }}
                                size={"small"}
                                key={criteria.id}
                                id={criteria.id}
                            />
                        </div>
                    ))}

                    <Button
                        className={s.publishButton}
                        variant={"contained"}
                        disabled={activeStep !== 4}
                        onClick={handleSendBtnClick}
                    >
                        {loader ? "Загружаем..." : "Опубликовать"}
                    </Button>

                    <Modal
                        open={openModal}
                        close={() => setOpenModal(false)}
                    >
                        <ModalWindow onClick={handleCloseModal} header={"Ваш опрос опубликован!"}
                                     link={"/stakeholder/results"}/>
                    </Modal>

                </div>
            </div>
        </>
    )
}

export default AddUserResult;
