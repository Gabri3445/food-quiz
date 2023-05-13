import type Question from "~/types/Question";
import path from "path";
import {promises as fs} from 'fs';
import Content from "~/components/Content";


const Page = async () => {
    const fetchData = async (): Promise<Question[]> => {
        const directory = path.join(process.cwd(), "data");
        const questions = await fs.readFile(path.join(directory, "questions.json"), "utf-8");
        const questionsArray = JSON.parse(questions) as Question[];
        questionsArray.sort(() => Math.random() - 0.5);
        for (const question of questionsArray) {
            question.answers.sort(() => Math.random() - 0.5);
        }
        return questionsArray;
    };

    const questions = await fetchData();

    return (
        <Content questions={questions}></Content>
    );
};


export default Page;