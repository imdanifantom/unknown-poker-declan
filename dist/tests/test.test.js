var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TexasHoldem } from "../src/index";
// import fs from "fs";
// const v8Profiler = require("v8-profiler-next");
test("test", () => __awaiter(void 0, void 0, void 0, function* () {
    // v8Profiler.setGenerateType(1);
    const table = new TexasHoldem();
    table.setPlayer(["Kd", "6s"]);
    table.setTable(["5d", "3h", "Kh", "4c", "8h"]);
    table.addOpponent(["7c", "2c"], { name: "bruh" });
    // table.addOpponent(["5c", "5s"], { name: "bruh2" });
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    // start timer
    // const start = Date.now();
    // const title = "test";
    // v8Profiler.startProfiling(title, true);
    const results = table.calculate();
    console.log(results.oppHandChances);
}));
