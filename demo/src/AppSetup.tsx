import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {ConfigManager} from "athena-x-sdk/dist/src";


export function initReactComponents() {
    console.log(process.env);
    InitRunTime()
    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    );
    root.render(
        <React.StrictMode>
            <p>Demo App</p>
        </React.StrictMode>
    );
}

function InitRunTime(): void {
    const configManager = ConfigManager.CreateConfigManagerInstance('REACT_APP_', {appName: "DEMO", environment: 'development'})

    console.log(configManager.get());

}
