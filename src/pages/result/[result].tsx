import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {useRouter} from "next/router";
import Result from "~/types/Result";
import path from "path";
import {promises as fs} from "fs";

interface ResultProps {
    results: Result[];
}

const Result: NextPage<ResultProps> = (props: ResultProps) => {
    const router = useRouter();
    const score = Number(router.query.result);

    const determineFood = (): string => {
        if (score) {
            for (const result of props.results) {
                if (score >= result.scoreRange.minScore && score <= result.scoreRange.maxScore) {
                    return result.result;
                }
            }
        }
        return "Error";
    };


    return (
        <>
            <div>
                <h1>Result</h1>
                <p>Score: {score}</p>
                <p>{determineFood()}</p>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps<ResultProps> = async () => {
    const directory = path.join(process.cwd(), "data");
    const results = await fs.readFile(path.join(directory, "results.json"), "utf-8");
    return {
        props: {
            results: JSON.parse(results)
        }
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = [...Array(16).keys()].map((score) => ({params: {result: score.toString()}}));
    return {paths, fallback: false};
};

export default Result;