import type {GetServerSideProps, NextPage} from "next";
import {type ChangeEvent, useState} from "react";
import Form from "~/components/Form";
import type Question from "~/types/Question";
import path from "path";
import {promises as fs} from 'fs';
import {useRouter} from "next/router";
import Head from "next/head";

interface Props {
    questions: Question[];
}

const Home: NextPage<Props> = (props: Props) => {
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [checkedElement, setCheckedElement] = useState<HTMLInputElement | null>(null);
    const router = useRouter();

    const handleClick = () => {
        if (currentQuestionNumber < props.questions.length - 1 && checkedElement) {
            setScore(score + Number(checkedElement.value));
            setCurrentQuestionNumber(currentQuestionNumber + 1);
            checkedElement.checked = false;
            setCheckedElement(null);
        } else if (checkedElement) {
            router.push(`/result/${score + Number(checkedElement.value)}`).then().catch(console.error);
        }
    };

    const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setCheckedElement(target);
    };
    return (
        <div className="w-screen h-screen overflow-hidden bg-gray-800">
            <Head>
                <meta name="title" content="Which Food Are You?"/>
                <meta name="description" content="Determines which food you are most similar to"/>
                <meta name="keywords" content="food, quiz"/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <title>Which Food Are You?</title>
            </Head>
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-center text-white">Which Food Are You?</h1>
                <div className="flex justify-center pt-14">
                    <Form
                        question={props.questions[currentQuestionNumber]!}
                        onClick={handleClick}
                        onChange={onFormChange}
                    />
                </div>
            </div>
        </div>
    );


};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const directory = path.join(process.cwd(), "data");
    const questions = await fs.readFile(path.join(directory, "questions.json"), "utf-8");
    const questionsArray = JSON.parse(questions) as Question[];
    questionsArray.sort(() => Math.random() - 0.5);
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
