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
test("scenario1", () => __awaiter(void 0, void 0, void 0, function* () {
    const table = new TexasHoldem(10000);
    table.setPlayer(["4h", "6s"]);
    table.setTable(["Ac", "6d", "Tc", "4c"]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    table.addOpponent([]);
    const results = table.calculate();
    expect(results.winChance).toBeCloseTo(0.35, 1);
    console.log("win chance is ", results.winChance, "which is close to 0.35");
}));
