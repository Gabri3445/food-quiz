import type {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {useRouter} from "next/router";
import Result from "~/types/Result";
import path from "path";
import {promises as fs} from "fs";
import Image from "next/image";

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

    const determineImage = (food: string): string => {
        const images = [
            "/pizza.png",
            "/sushi.png",
            "/burger.png",
        ];
        if (food.includes("pizza")) {
            return images[0];
        } else if (food.includes("sushi")) {
            return images[1];
        }
        return images[2];
    };

    const food = determineFood();
    const image = determineImage(food);

    return (
        <div className="w-screen h-screen  bg-gray-800">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-center text-white mb-10">Result</h1>
                <p className="text-3xl font-bold text-center text-white">Score: {score}</p>
                <p className="text-3xl font-bold text-center text-white">{food}</p>
                <div className="flex justify-center mt-10">
                    <Image priority={true} src={image} alt={food} width={512} height={512}></Image>
                </div>
            </div>

        </div>
    );
};

export const getStaticProps: GetStaticProps<ResultProps> = async () => {
    const directory = path.join(process.cwd(), "data");
    const results = await fs.readFile(path.join(directory, "results.json"), "utf-8");
    const resultsArray = JSON.parse(results) as Result[];
    return {
        props: {
            results: resultsArray
        }
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    const paths = [...Array(16).keys()].map((score) => ({params: {result: score.toString()}}));
    return {paths, fallback: false};
};

export default Result;