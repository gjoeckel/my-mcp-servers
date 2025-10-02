#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function createFile(filePath, content) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ File created: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to create file ${filePath}: ${error.message}`);
        return false;
    }
}

const [, , filePath, content] = process.argv;
if (filePath && content) {
    createFile(filePath, content);
} else {
    console.log("Usage: node create-file.js <filePath> <content>");
}