import { Editor, DiffEditor } from "@monaco-editor/react";
import "./index.scss";
import PagesIcon from "@mui/icons-material/Pages";
import { Breadcrumbs, Tooltip, Typography } from "@mui/material";
import { useEffect, useState, Suspense } from "react";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GithubIcon from "@mui/icons-material/GitHub";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
export default function CodeEditor() {
    document.body.style.overflow = "hidden";
    const [openSidebar, setOpenSidebar] = useState(true);
    const [currentType, setCurrentType] = useState("file");
    const [currentFile, setCurrentFile] = useState<any>(null);
    const [currentFileData, setCurrentFileData] = useState<any>(null);
    const [originalFileData, setOriginalFileData] = useState<any>(null);
    const [currentExtension, setCurrentExtension] = useState<string>("javascript");

    function parseExtension(extension: string) {
        if(extension === "js") return "javascript";
        if(extension === "py") return "python";
        if(extension === "ts") return "typescript";
        if(extension === "md") return "markdown";
        if(extension === "jsx") return "javascriptreact";
        if(extension === "tsx") return "typescriptreact";
        return extension;
    }

    const openTheSidebar = () => {
        setOpenSidebar(true);
    };

    const closeTheSidebar = () => {
        setOpenSidebar(false);
    };

    const handleTypeChange = (type: string) => {
        setCurrentType(type);
    };

    const [files, setFiles] = useState<any[]>([]);

    // fetch files from /api/folders endpoint
    // prevent fetch from running multiple times
    useEffect(() => {
        if (files.length > 0) return;
        fetch("http://localhost:3000/api/folders/graph", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setFiles(data.data);
                console.log(data.data);
            });
    }, []);

    // function createFile(_file: any) {}

    function File({ files }: { files: unknown[] }) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <div className="filePanel">
                    <div className="fil"></div>
                </div>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    {recursiveFileLoop(files)}
                </TreeView>
            </Suspense>
        );
    }

    function recursiveFileLoop(files: any[]) {
        return files.map((file) => {
            const children = file.children
                ? recursiveFileLoop(file.children)
                : [];
            return (
                <TreeItem
                    nodeId={file.name}
                    label={file.name}
                    sx={{
                        color: "white",
                    }}
                    onClick={async (_e) => {
                        _e.preventDefault();
                        if (file.type === 0) {
                            console.log(file);
                            setCurrentFile(file.path);
                            const data = await fetch(
                                `http://localhost:3000/api/files/get-content`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem(
                                            "token",
                                        )}`,
                                    },
                                    body: JSON.stringify({
                                        path: file.path,
                                    }),
                                },
                            ).then((res) => res.json());

                            setCurrentFileData(data.data);
                            setOriginalFileData(data.data);
                            const extension = file.name.split(".").pop();
                            setCurrentExtension(parseExtension(extension));
                        }
                    }}
                >
                    {children}
                </TreeItem>
            );
        });
    }

    return (
        <div className="editor">
            <div className="panel">
                <div className="options">
                    <div className="option">
                        <Tooltip title="Files">
                            <PagesIcon
                                sx={{
                                    color: "white",
                                }}
                                onClick={(_) => {
                                    console.log(openSidebar,currentType)
                                    if (!openSidebar) {
                                        openTheSidebar();
                                        handleTypeChange("file");
                                    } else if (
                                        openSidebar &&
                                        currentType === "file"
                                    )
                                        closeTheSidebar();
                                    else if (
                                        openSidebar &&
                                        currentType !== "file"
                                    )
                                        handleTypeChange("file");
                                }}
                            />
                        </Tooltip>
                    </div>
                    <div className="option">
                        <Tooltip title="Difference">
                            <GithubIcon
                                sx={{
                                    color: "white",
                                }}
                                onClick={(_) => {
                                    if (!openSidebar) {
                                        openTheSidebar();
                                        handleTypeChange("diff");
                                    } else if (
                                        openSidebar &&
                                        currentType === "diff"
                                    )
                                        closeTheSidebar();
                                    else if (
                                        openSidebar &&
                                        currentType !== "diff"
                                    )
                                        handleTypeChange("diff");
                                }}
                            />
                        </Tooltip>
                    </div>
                </div>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" sx={{ color: "white"}} />}
                    aria-label="breadcrumb"
                >
                    {(currentFile ?? "@root").split("/").map((file: string) => {
                        return (
                            <Typography
                                sx={{
                                    color: "white",
                                }}
                            >
                                {file}
                            </Typography>
                        );
                    })}
                </Breadcrumbs>
            </div>
            <div className="container">
                <div
                    className="fileSidebar"
                    style={{
                        width: openSidebar ? "300px" : "0vw",
                    }}
                >
                    {currentType === "file" ? (
                        <File files={files} />
                    ) : (
                        <div>Folder</div>
                    )}
                </div>
                {currentType === "diff" ? (
                    <DiffEditor
                        height="90vh"
                        original={originalFileData}
                        modified={currentFileData}
                        language={currentExtension}
                        theme="vs-dark"
                        className="ide"
                        options={{
                            fontSize: 16,
                            fontFamily: "Dosis",
                        }}
                    />
                ) : (
                    <Editor
                        height="90vh"
                        width={
                            openSidebar ? "calc(100vw - 300px)" : "calc(100vw)"
                        }
                        language={currentExtension}
                        value={currentFileData}
                        onChange={(value) => {
                            setCurrentFileData(value);
                        }}
                        className="ide"
                        theme="vs-dark"
                        options={{
                            fontSize: 16,
                            fontFamily: "Dosis",
                        }}
                    />
                )}
            </div>
        </div>
    );
}
