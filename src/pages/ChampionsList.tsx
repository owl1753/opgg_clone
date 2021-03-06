import React from "react";
import styled from "styled-components";
import classnames from "classnames";
import Champion from "../components/Champion";
import axios from "axios";

import ChampionModel from "../models/ChampionModel";
import ChampionTrendItem from "../components/ChampionTrendItem";
import { collapseTextChangeRangesAcrossMultipleVersions, isTemplateTail } from "typescript";
import championTier1 from "../assets/icon-champtier-1.png";
import tierStay from "../assets/icon-championtier-stay.png";
import champion32 from "../assets/champion32.png"
import ChampionTrendHeader from "../components/ChampionTrendHeader";
import ChampionTrendToolbar from "../components/ChampionTrendToolbar";
import ChampionTrendModel from "../models/ChampionTrendModel";
import championTier from "../assets/championIcon.png";
import championTierN from "../assets/icon-champion-n.png";

interface ChampionListProps{

}

interface ChampionListState{
    allChampions: ChampionModel[];
    champions: ChampionModel[];
    type: string;
    input: string;

    trendChampions: ChampionTrendModel[];
    trendType: string;
    trendPosition: string;
}

const ChampionListPageWrapper = styled.div`
    display: flex;
    width: 1080px;
    margin: 0 auto;
    margin-top: 100px;
`

// List of champion page
export default class ChampionsList extends React.Component<ChampionListProps, ChampionListState>{

    constructor(props: ChampionListProps){
        super(props);

        this.state = {
            allChampions: [],
            champions: [],
            type: "ALL",
            input: "",

            trendChampions: [],
            trendType: "tier",
            trendPosition: "top",
        }
    }

    async componentDidMount(){
        const response = await axios.get("http://opgg.dudco.kr/champion");
        const allChampions = response.data.map((data: any) =>
            new ChampionModel({
                id: data.id, 
                name: data.name, 
                key: data.key, 
                position: data.position
            })
        );

        const trendChampions = await this.getTrendList("tier");

        this.setState({
            allChampions,
            champions: allChampions,
            trendChampions,
        });
    }
    
    componentDidUpdate(){

    }

    componentWillUnmount(){

    }

    onChangeType = (type: string) => () => {
        document.getElementsByTagName("input")[1].value = "";
        this.setState({
            type: type,
            input: "",
            champions: this.filterChampions(type),
        });
    }

    onChangeInput = (input: string) => {
        this.setState({
            input: input,
            champions: this.searchChampions(input),
        });
    }

    filterChampions = (type: string) => {
        switch (type){
            case "TOP":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("???") > -1);
            case "JUG":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("??????") > -1);
            case "MID":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("??????") > -1);
            case "ADC":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("??????") > -1);
            case "SUP":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("?????????") > -1);
            default:
                return this.state.allChampions;
        }
    }

    searchChampions = (input: string) => {
        var temp;
        switch (this.state.type){
            case "TOP":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("???") > -1);
                break;
            case "JUG":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("??????") > -1);
                break;
            case "MID":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("??????") > -1);
                break;
            case "ADC":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("??????") > -1);
                break;
            case "SUP":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("?????????") > -1);
                break;
            default:
                temp = this.state.allChampions;
        }
        if (input === ""){
            return temp;
        }
        return temp.filter((c, dix) => c.name?.includes(input));
    }

    onClickTrendType = (type: string) => async () => {
        const trendChampions = await this.getTrendList(type);
        this.setState({trendType: type, trendChampions, trendPosition: type === "tier" ? "top" : "all"});
    }

    onClickTrendPosition = (position: string) => async() => {
        const trendChampions = await this.getTrendList(this.state.trendType, position);
        this.setState({trendChampions, trendPosition: position});
    }

    getTrendList = async (type:string, position?: string) => {
        if(!position){
            if (type === "tier") position = "top"
            else position = "all";
        }
        const responseTrend = await axios.get(`http://opgg.dudco.kr/champion/trend/${type}/${position}`);
        const trendChampions = responseTrend.data.map((data: any) => 
            new ChampionTrendModel({
                id: data.id,
                rank: data.rank,
                change: data.change,
                name: data.name,
                position: data.position,
                winRate: data.winRate,
                pickRate: data.pickRate,
                banRate: data.banRate,
                tierIcon: data.tierIcon,
            })
        );

        return trendChampions;
    }

    render() {
        return (
            <ChampionListPageWrapper>
                <ChampionsWrapper>
                    <div className="header">
                        <div className="item-wrap">
                            <div className={classnames("item", {select: this.state.type === "ALL"})} onClick={this.onChangeType("ALL")}>??????</div>
                            <div className={classnames("item", {select: this.state.type === "TOP"})} onClick={this.onChangeType("TOP")}>???</div>
                            <div className={classnames("item", {select: this.state.type === "JUG"})} onClick={this.onChangeType("JUG")}>??????</div>
                            <div className={classnames("item", {select: this.state.type === "MID"})} onClick={this.onChangeType("MID")}>??????</div>
                            <div className={classnames("item", {select: this.state.type === "ADC"})} onClick={this.onChangeType("ADC")}>??????</div>
                            <div className={classnames("item", {select: this.state.type === "SUP"})} onClick={this.onChangeType("SUP")}>?????????</div>
                        </div>
                        <input 
                            type="text" 
                            placeholder="????????? ?????? (??????, ??????, ...)" 
                            onChange = {(e) => this.onChangeInput(e.target.value)}
                        />
                    </div>
                    <div className="list">
                        {
                            this.state.champions.map((data) =>
                                <Champion
                                    key={data.id}
                                    id={Number(data.id) || 0}
                                    position={data.position || []}
                                    name = {data.name || ""}
                                />
                            )
                        }
                        {[1, 2, 3, 4, 5, 6].map(() => <div style={{width: "82px", height: 0}}/>)}
                    </div>
                </ChampionsWrapper>
                <ChampionsTrendWrapper>
                    <div className="header">
                        <div className="item">????????? ??????</div>
                        <div className="item-wrap">
                            <div 
                                className={classnames("item", {select: this.state.trendType === "tier"})} 
                                onClick={this.onClickTrendType("tier")}
                            >
                                <img src={this.state.trendType === "tier" ? championTier : championTierN}/>
                                ??????
                            </div>
                            <div 
                                className={classnames("item", {select: this.state.trendType === "winratio"})} 
                                onClick={this.onClickTrendType("winratio")}
                            >
                                ??????
                            </div>
                            <div 
                                className={classnames("item", {select: this.state.trendType === "pickratio"})} 
                                onClick={this.onClickTrendType("pickratio")}
                            >
                                ??????
                            </div>
                            <div 
                                className={classnames("item", {select: this.state.trendType === "banratio"})} 
                                onClick={this.onClickTrendType("banratio")}
                            >
                                ??????
                            </div>
                        </div>
                    </div>
                    <div className="list">
                        <ChampionTrendToolbar>
                            <div className={classnames({select: this.state.trendPosition === "all"})} onClick={this.onClickTrendPosition("all")} hidden={this.state.trendType === "tier"}>??????</div>
                            <div className={classnames({select: this.state.trendPosition === "top"})} onClick={this.onClickTrendPosition("top")}>???</div>
                            <div className={classnames({select: this.state.trendPosition === "jungle"})} onClick={this.onClickTrendPosition("jungle")}>??????</div>
                            <div className={classnames({select: this.state.trendPosition === "mid"})} onClick={this.onClickTrendPosition("mid")}>??????</div>
                            <div className={classnames({select: this.state.trendPosition === "adc"})} onClick={this.onClickTrendPosition("adc")}>??????</div>
                            <div className={classnames({select: this.state.trendPosition === "support"})} onClick={this.onClickTrendPosition("support")}>?????????</div>
                        </ChampionTrendToolbar>
                        <ChampionTrendHeader>
                            <div>#</div>
                            <div>?????????</div>
                            <div className={classnames({select: this.state.trendType === "winratio"})} hidden={this.state.trendType === "banratio"}>??????</div>
                            <div className={classnames({select: this.state.trendType === "pickratio"})} hidden={this.state.trendType === "banratio"}>??????</div>
                            <div hidden={this.state.trendType !== "tier"}>??????</div>
                            <div hidden={this.state.trendType !== "banratio"}>??????</div>
                        </ChampionTrendHeader>               
                        {
                            this.state.trendChampions.map(c => 
                            <ChampionTrendItem
                                championID={c.id}
                                change={c.change}
                                name={c.name}
                                position={c.position}
                                win={c.winRate}
                                pick={c.pickRate}
                                ban={c.banRate}
                                tier={c.tierIcon}
                                rank={c.rank}
                                type={this.state.trendType}
                            />)
                        }
                    </div>
                </ChampionsTrendWrapper>
            </ChampionListPageWrapper>
        )
    }
}   

const ChampionsWrapper = styled.div`
    border-right: 1px solid #e9eff4;

    & > .header{
        display: flex;
        justify-content: space-between;
        padding: 0 17px;
        border-bottom: 1px solid #e9eff4;
        background-color: white;

        & > .item-wrap{
            display: flex;
        }

        & > .item-wrap > .item {
            line-height: 60px;
            padding: 0 12px;
            color: rgba(0, 0, 0, .6);
            cursor: pointer;

            &.select {
                box-shadow: 0px -3px 0px 0px #5383e8 inset;
                color: #5383e8;
                font-weight: bold;
            }
        }

        

        & > input {
            width: 200px;
            margin: 10px 0;
            padding: 0 10px;
            border: none;
            background-color: #f7f7f7;
        }
    }

    & > .list{
        width: 564px;
        background-color: #f7f7f7;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 30px;
    }
`

const ChampionsTrendWrapper = styled.div`
    flex: 1;
    background-color: white;
    border-right: 1px solid #e9eff4;

    & > .header{
        display: flex;
        justify-content: space-between;
        padding: 0 17px;
        border-bottom: 1px solid #e9eff4;
        line-height: 60px;
        font-weight: bold;
        
        & > .item-wrap{
            display: flex;
            justify-content: space-between;
            

            & > .item{
                line-height: 60px;
                padding: 0 12px;
                color: rgba(0, 0, 0, .6);
                cursor: pointer;
                position: relative;

                &.select {
                    box-shadow: 0px -3px 0px 0px #5383e8 inset;
                    color: #5383e8;
                }

                &:not(:last-child)::after{
                    content: "";
                    width: 1px;
                    height: 20px;
                    background: #eee;
                    position: absolute;
                    right: -1px;
                    top: 35%;
                }
            }
        }
    }

    & > div.list{
        background-color: #f7f7f7;
        padding: 20px;
    }
`

