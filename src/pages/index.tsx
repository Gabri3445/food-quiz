import type {GetServerSideProps, NextPage} from "next";
import {type ChangeEvent, type MouseEvent, useState} from "react";
import Form from "~/components/Form";
import type Question from "~/types/Question";
import path from "path";
import {promises as fs} from 'fs';
import {useRouter} from "next/router";

interface Props {
    questions: Question[];
}

const Home: NextPage<Props> = (props: Props) => {
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [checkedElement, setCheckedElement] = useState<HTMLInputElement | null>(null);
    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (currentQuestionNumber < props.questions.length - 1 && checkedElement) {
            setCurrentQuestionNumber(currentQuestionNumber + 1);
            checkedElement.checked = false;
            setCheckedElement(null);
        } else if (checkedElement) {
            router.push(`/result/${score}`).then().catch(console.error);
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
                className="flex flex-col items-center justify-center"
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
