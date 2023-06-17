import { AoiClient } from "aoi.js";
import { PathType, Perms } from "./enum.js";
import express from "express";
import { Panel } from "../panel.js";
export interface PanelParams {
    port: number;
    client: AoiClient;
    adminKey: string;
    refreshOptions: RefreshOptions;
    adminData: Omit<UserData,"perms">;
}

export interface RefreshOptions {
    interval: number;
    enabled: boolean;
    key: string;
}

export interface UserData {
    username: string;
    password: string;
    perms: Perms;
}

export interface SourceTreePath {
    type: PathType;
    path: string;
    name: string;
    children?: string[];

}

export interface AoiPanelRequest extends express.Request {
    panel:Panel;
    user:Omit<UserData,"password">;
}

export interface graphData {
    id: string;
    name: string;
    children: graphData[];
}