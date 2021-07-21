import React from "react";
import styled from "styled-components";
import classnames from "classnames";
import Champion from "../components/Champion";
import axios from "axios";
import ChampionModel from "../models/ChampionModel";
import { isTemplateTail } from "typescript";

interface ChampionListProps{

}

interface ChampionListState{
    allChampions: ChampionModel[]
    champions: ChampionModel[]
    type: string;
    input: string;
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
        this.setState({
            allChampions,
            champions: allChampions,
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
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("탑") > -1);
            case "JUG":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("정글") > -1);
            case "MID":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("미드") > -1);
            case "ADC":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("바텀") > -1);
            case "SUP":
                return this.state.allChampions.filter((c, dix) => c.position!!.indexOf("서포터") > -1);
            default:
                return this.state.allChampions;
        }
    }

    searchChampions = (input: string) => {
        var temp;
        switch (this.state.type){
            case "TOP":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("탑") > -1);
                break;
            case "JUG":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("정글") > -1);
                break;
            case "MID":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("미드") > -1);
                break;
            case "ADC":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("바텀") > -1);
                break;
            case "SUP":
                temp = this.state.allChampions.filter((c, dix) => c.position!!.indexOf("서포터") > -1);
                break;
            default:
                temp = this.state.allChampions;
        }
        if (input === ""){
            return temp;
        }
        return temp.filter((c, dix) => c.name!!.indexOf(input) > -1);
    }

    render() {
        return (
            <ChampionListPageWrapper>
                <ChampionsWrapper>
                    <div className="header">
                        <div className="item-wrap">
                            <div className={classnames("item", {select: this.state.type === "ALL"})} onClick={this.onChangeType("ALL")}>전체</div>
                            <div className={classnames("item", {select: this.state.type === "TOP"})} onClick={this.onChangeType("TOP")}>탑</div>
                            <div className={classnames("item", {select: this.state.type === "JUG"})} onClick={this.onChangeType("JUG")}>정글</div>
                            <div className={classnames("item", {select: this.state.type === "MID"})} onClick={this.onChangeType("MID")}>미드</div>
                            <div className={classnames("item", {select: this.state.type === "ADC"})} onClick={this.onChangeType("ADC")}>원딜</div>
                            <div className={classnames("item", {select: this.state.type === "SUP"})} onClick={this.onChangeType("SUP")}>서포터</div>
                        </div>
                        <input 
                            type="text" 
                            placeholder="챔피언 검색 (가렌, ㄱㄹ, ...)" 
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
                    trends
                </ChampionsTrendWrapper>
            </ChampionListPageWrapper>
        )
    }
}   

const ChampionsWrapper = styled.div`
    background-color: white;
    border-right: 1px solid #e9eff4;

    & > .header{
        display: flex;
        justify-content: space-between;
        padding: 0 17px;
        border-bottom: 1px solid #e9eff4;

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
    
`

