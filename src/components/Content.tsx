import { tokenAtom } from "@/store/atoms/atoms";
import axios from "axios";
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Tweet } from 'react-twitter-widgets'

const url = import.meta.env.VITE_GET_CONTENT_ENDPOINT

interface contentType {
    link: string;
    linkType: string;
    tags: string[];
    title: string
}

const Content = () => {
    const [token, setToken] = useRecoilState(tokenAtom)
    const [contents, setContents] = useState<contentType[]>();

    useEffect(() => {
        axios.post(url, { token: token })
            .then(response => {
                const dataArray = response.data.data;
                const extractedInfo = dataArray.map(item => ({
                    link: item.link,
                    linkType: item.linkType,
                    tags: item.tags.map(tag => ({ title: tag.title })),
                    title: item.title,
                }));

                setContents(extractedInfo)
            })
            .catch(error => {
                console.error(error);
            });
    }, [token])

    function convertFigmaUrl(originalUrl: string): string {
        const url = new URL(originalUrl);
        const path = url.pathname;
        const nodeId = url.searchParams.get("node-id");
        const embedUrl = `https://embed.figma.com${path}?node-id=${nodeId}&embed-host=share`;
        return embedUrl;
    }

    function convertToEmbedURL(videoURL: string): string {
        const videoID = videoURL.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        //@ts-ignore
        return `https://www.youtube.com/embed/${videoID[1]}`;
    }

    function convertToEmbedUrl(url: string): string {
        // Regex to match the URL for playlist, album, track, or episode
        const playlistRegex = /https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/;
        const albumRegex = /https:\/\/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/;
        const trackRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const episodeRegex = /https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/;

        let match;
        let embedUrl = '';

        // Check for playlist
        match = url.match(playlistRegex);
        if (match && match[1]) {
            embedUrl = `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=oembed`;
        }
        // Check for album
        else if (match = url.match(albumRegex)) {
            embedUrl = `https://open.spotify.com/embed/album/${match[1]}?utm_source=oembed`;
        }
        // Check for track
        else if (match = url.match(trackRegex)) {
            embedUrl = `https://open.spotify.com/embed/track/${match[1]}?utm_source=oembed`;
        }
        // Check for episode
        else if (match = url.match(episodeRegex)) {
            embedUrl = `https://open.spotify.com/embed/episode/${match[1]}?utm_source=oembed`;
        }
        return embedUrl;
    }



    return (
        <div className="absolute top-28 p-4 h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contents?.map((content, i) => (
                    <Card
                        key={i}
                        className="bg-black text-white border-[#26262A] w-full"
                    >
                        <CardHeader>
                            <CardTitle>{content.title}</CardTitle>
                        </CardHeader>
                        <div className="flex flex-row justify-center items-start gap-4 p-4">
                            {content.linkType === "tweet" && (
                                <CardContent className="flex-shrink-0 w-full">
                                    {/* @ts-ignore */}
                                    <Tweet tweetId={content.link.split("/").pop()} />
                                </CardContent>
                            )}
                            {content.linkType === "code" && (
                                <CardContent className="flex-shrink-0 w-full">
                                    <iframe
                                        src={`${content.link}?embed=true`}
                                        title="Code Viewer"
                                        className="w-full h-64 border rounded-lg"
                                        allowFullScreen
                                    ></iframe>
                                </CardContent>
                            )}
                            {content.linkType === "figma" && (
                                <CardContent className="flex-shrink-0 w-full">
                                    <iframe
                                        src={convertFigmaUrl(content.link)}
                                        title="Figma Design"
                                        className="w-full h-64 border rounded-lg"
                                        allowFullScreen
                                    ></iframe>
                                </CardContent>
                            )}
                            {content.linkType === "image" && (
                                <CardContent className="flex-shrink-0 w-full">
                                    <img
                                        src={content.link}
                                        alt="Content Preview"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </CardContent>
                            )}
                            {content.linkType === "video" && (
                                <CardContent>
                                    <iframe
                                        src={convertToEmbedURL(content.link)}
                                        className="w-full h-64 border rounded-lg"
                                        allowFullScreen
                                    />
                                </CardContent>
                            )}
                            {
                                content.linkType === "audio" && (
                                    <CardContent>
                                        <iframe
                                            src={convertToEmbedUrl(content.link)}
                                            className="w-full h-64 border rounded-lg"
                                            allowFullScreen
                                        />
                                    </CardContent>
                                )
                            }
                        </div>
                        <CardFooter>
                            {content.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-xs text-blue-800 px-2 py-1 rounded"
                                >
                                    {tag.title}
                                </span>
                            ))}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Content;
