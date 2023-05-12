import {GetServerSideProps, type NextPage} from "next";
import {ChangeEvent, MouseEvent, useState} from "react";
import Form from "~/components/Form";
import Question from "~/types/Question";
import path from "path";
import {promises as fs} from 'fs';
import {useRouter} from "next/router";

interface Props {
    questions: Question[];
}

const Home: NextPage<Props> = (props: Props) => {
    let [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    let [score, setScore] = useState(0);
    let [checkedElement, setCheckedElement] = useState<HTMLInputElement | null>(null);
    const router = useRouter();

    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentQuestionNumber < props.questions.length - 1 && checkedElement) {
            setCurrentQuestionNumber(currentQuestionNumber + 1);
            checkedElement.checked = false;
            setCheckedElement(null);
        } else if (checkedElement) {
            await router.push(`/result/${score}`);
        }
    };

    const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setCheckedElement(target);
        setScore(score + Number(target.value));
    };
    return (
        <>
            <Form
                question={props.questions[currentQuestionNumber]!}
                onClick={handleClick}
                onChange={onFormChange}
            />
        </>
    );


};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const directory = path.join(process.cwd(), "data");
    const questions = await fs.readFile(path.join(directory, "questions.json"), "utf-8");
    const questionsArray = JSON.parse(questions) as Question[];
    for (const question of questionsArray) {
        question.answers.sort(() => Math.random() - 0.5);
    }
    return {
        props: {
            questions: questionsArray
        }
    };
};

export default Home;
