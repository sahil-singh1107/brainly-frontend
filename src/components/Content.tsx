// @ts-nocheck
import { tagsAtom, tokenAtom } from "@/store/atoms/atoms";
import axios from "axios";
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tweet } from 'react-tweet'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarImage } from "./ui/avatar";
import { CalendarDays } from "lucide-react";

const url = import.meta.env.VITE_GET_CONTENT_ENDPOINT

interface contentType {
    link: string;
    linkType: string;
    tags: string[]; 
    title: string;
    createAt: Date;
}

const Content = () => {
    const [token, setToken] = useRecoilState(tokenAtom)
    const [contents, setContents] = useState<contentType[]>();
    const [selectedTags, setSelectedTags] = useRecoilState(tagsAtom)

    useEffect(() => {
        if (token && selectedTags.length === 0) {
            axios.post(url, { token: token })
                .then(response => {
                    const dataArray = response.data.data;
                    const extractedInfo = dataArray.map(item => ({
                        link: item.link,
                        linkType: item.linkType,
                        tags: item.tags.map(tag => ({ title: tag.title })),
                        title: item.title,
                        createdAt: item.createdAt
                    }));
                    setContents(extractedInfo)
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }, [token]);

    useEffect(() => {
        if (selectedTags.length > 0 && token) {
            axios.post("https://brainly-production.up.railway.app/api/v1/getPosts", { token, tags: selectedTags }).then(response => {
                const dataArray = response.data.data;
                const extractedInfo = dataArray.map(item => ({
                    link: item.link,
                    linkType: item.linkType,
                    tags: item.tags.map(tag => ({ title: tag.title })),
                    title: item.title,
                    createdAt: item.createdAt
                }));
                setContents(extractedInfo)
            }).catch(error => {
                console.error("Error:", error);
            });
        }
    }, [token]);

    function convertFigmaUrl(originalUrl: string): string {
        const url = new URL(originalUrl);
        const path = url.pathname;
        const nodeId = url.searchParams.get("node-id");
        return `https://embed.figma.com${path}?node-id=${nodeId}&embed-host=share`;
    }

    function convertToEmbedURL(videoURL: string): string {
        const videoID = videoURL.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return `https://www.youtube.com/embed/${videoID[1]}`;
    }

    function convertToEmbedUrl(url: string): string {
        const playlistRegex = /https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/;
        const albumRegex = /https:\/\/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/;
        const trackRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const episodeRegex = /https:\/\/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/;

        let match;
        let embedUrl = '';

        match = url.match(playlistRegex);
        if (match && match[1]) {
            embedUrl = `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=oembed`;
        } else if (match = url.match(albumRegex)) {
            embedUrl = `https://open.spotify.com/embed/album/${match[1]}?utm_source=oembed`;
        } else if (match = url.match(trackRegex)) {
            embedUrl = `https://open.spotify.com/embed/track/${match[1]}?utm_source=oembed`;
        } else if (match = url.match(episodeRegex)) {
            embedUrl = `https://open.spotify.com/embed/episode/${match[1]}?utm_source=oembed`;
        }
        return embedUrl;
    }

    return (
        <div className="absolute top-28 p-4 h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contents?.map((content, i) => (
                    <HoverCard key={i}>
                        <HoverCardTrigger>
                            <Card
                                className="bg-black text-white border-[#26262A] border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300 ease-in-out p-3 max-w-[300px] w-full mx-auto"
                            >
                                <CardHeader>
                                    <CardTitle className="text-sm">{content.title}</CardTitle>
                                </CardHeader>
                                <div className="flex flex-row justify-center items-start gap-4 p-2">
                                    {content.linkType === "tweet" && (
                                        <CardContent className="flex-shrink-0 w-full">
                                            <div className="w-full" style={{ height: "auto", maxHeight: "200px", overflow: "hidden" }}>
                                                {/* Adjusted wrapper height and overflow */}
                                                <Tweet id={content.link.split("/").pop()} />
                                            </div>
                                        </CardContent>
                                    )}
                                    {content.linkType === "code" && (
                                        <CardContent className="flex-shrink-0 w-full">
                                            <iframe
                                                src={`${content.link}?embed=true`}
                                                title="Code Viewer"
                                                className="w-full h-48 border rounded-lg"
                                                allowFullScreen
                                            ></iframe>
                                        </CardContent>
                                    )}
                                    {content.linkType === "figma" && (
                                        <CardContent className="flex-shrink-0 w-full">
                                            <iframe
                                                src={convertFigmaUrl(content.link)}
                                                title="Figma Design"
                                                className="w-full h-48 border rounded-lg"
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
                                                className="w-full h-48 border rounded-lg"
                                                allowFullScreen
                                            />
                                        </CardContent>
                                    )}
                                    {content.linkType === "audio" && (
                                        <CardContent>
                                            <iframe
                                                src={convertToEmbedUrl(content.link)}
                                                className="w-full h-48 border rounded-lg"
                                                allowFullScreen
                                            />
                                        </CardContent>
                                    )}
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
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                                <Avatar>
                                    <AvatarImage src={`./logos/${content.linkType}.png`} alt={content.linkType} />
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-white">{content.title}</h4>
                                    <p className="text-sm">
                                        {content.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                            >
                                                {tag.title}
                                            </span>
                                        ))}
                                    </p>
                                    <div className="flex items-center pt-2">
                                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                                        <span className="text-xs text-muted-foreground">
                                            Created {content.createdAt?.slice(0, 19).replace("T", " ")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>
        </div>
    );
}

export default Content;
