import type {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {useRouter} from "next/router";
import Result from "~/types/Result";
import path from "path";
import {promises as fs} from "fs";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

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
            if (score == 104) {
                return "You are down";
            }
        }
        return "Error";
    };

    const determineImage = (food: string): string => {
        const images: string[] = [
            "/pizza.png",
            "/sushi.png",
            "/burger.png",
        ];
        if (food.includes("pizza")) {
            if (images[0]) {
                return images[0];
            }
        } else if (food.includes("sushi")) {
            if (images[1]) {
                return images[1];
            }
        } else if (food.includes("burger")) {
            if (images[2]) {
                return images[2];
            }
        }
        return "Error";
    };

    const food = determineFood();
    const image = determineImage(food);

    return (
        <div className="w-screen h-screen  bg-gray-800">
            <Head>
                <meta name="title" content="Which Food Are You?"/>
                <meta name="description" content="Determines which food you are most similar to"/>
                <meta name="keywords" content="food, quiz"/>
                <meta name="robots" content="index, follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <title>Which Food Are You?</title>
            </Head>
            <div className="container mx-auto max-w-screen-sm px-4 py-16">
                <h1 className="text-3xl font-bold text-center text-white mb-10">Result</h1>
                <p className="text-3xl font-bold text-center text-white">Score: {score}</p>
                <p className="text-3xl font-bold text-center text-white">{food}</p>
                <div className="flex justify-end mt-10">
                    <Link
                        href="/"
                        className="text-white bg-blue-700 hover:bg-white hover:text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        replace={true}
                    >Go Back
                    </Link>
                </div>
                <div className="flex justify-center mt-10">
                    {(() => {
                        if (image.includes(".png")) {
                            return <Image priority={true} src={image} alt={food} width={512} height={512}/>;
                        }
                        return (
                            <video autoPlay loop muted playsInline>
                                <source src="/jerma.webm" type="video/webm"/>
                            </video>
                        );
                    })()}
                </div>
            </div>

        </div>
    );
}
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
    const paths = [];

    for (let score = 1; score < 16; score++) {
        paths.push({params: {result: score.toString()}});
    }

    paths.push({params: {result: "104"}});

    return {paths, fallback: false};
};

export default Result;