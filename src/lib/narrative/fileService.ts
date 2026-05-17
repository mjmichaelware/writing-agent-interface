import { promises as fs } from "fs";
import { loadIndex } from "./indexStore";

const cache=new Map<string,string>();

export async function getFile(name:string){
if(cache.has(name))return cache.get(name)!;

const index=await loadIndex();
const file=index.find(f=>f.name===name);
if(!file)throw Error("missing:"+name);

const raw=await fs.readFile(file.path,"utf8");
const clean=raw.replace(/^\uFEFF/,"").replace(/\r/g,"");

cache.set(name,clean);
return clean;
}

export async function getAll(){
return loadIndex();
}

export function split(t:string){
return t.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
}
