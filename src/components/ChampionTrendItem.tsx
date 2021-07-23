import React from "react"
import championTier1 from "../assets/icon-champtier-1.png";

import classnames from "classnames"
import tierStay from "../assets/icon-championtier-stay.png";
import tierDown from "../assets/icon-championtier-down.png";
import tierUp from "../assets/icon-championtier-up.png";

import champion32 from "../assets/champion32.png"
import championIcon from "../assets/championIcon.png";
import styled from "styled-components";
import ChampionTrendHeader from "./ChampionTrendHeader";

interface ChampionTrendItemProps{
    championID: number;
    change: number;
    name: string;
    position: string;
    win: string;
    pick: string;
    ban: string;
    tier: string;
    rank: string;
    type: string;
}

const ChampionTrendItemWrapper = styled(ChampionTrendHeader)`
    background-color: white;
    border: 1px solid #e9eff4;

    &:not(:last-child){
        border-bottom: none;
    }

    & > .rank{
        font-style: italic;
        font-size: 20px;
        order: -1;
    }

    & > .champ{
        display: flex;
        align-items: center;
        text-align: left;
        order: -1;

        & > .change{
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 14px;
            padding: 0 18px;
            width: 50px;
            box-sizing: border-box;

            & > img{
                margin-right: 5px;
            } 

            &.up{
                color: green;
            }
            
            &.down {
                color: red;
            }
        }
        & > .champ-img{
            width: 32px;
            height: 32px;
            background-image: url(${champion32});
        }
        & > .champ-desc{
            font-size: 12px;
            margin-left: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            & > :first-child {
                font-weight: bold;
            }
        }
    }

    & > .select{
        color: #5383e8;
        order: -1;
    }
`

const ChampionTrendItem: React.FC<ChampionTrendItemProps> = (props) => {

    const getTierChangeIcon = () => {
        if(props.change > 0) {
            return tierUp;
        } else if(props.change < 0){
            return tierDown;
        } else {
            return tierStay;
        }
    }

    return (
        <ChampionTrendItemWrapper>
            <div className="rank">{props.rank}</div>
            <div className="champ">
                <div className={classnames("change", {up: props.change > 0, down: props.change < 0})} hidden={props.type !== 'tier'}>
                    <img src={getTierChangeIcon()} alt="" hidden={props.type !== 'tier'}/>
                    <span hidden={props.type !== 'tier'}>{Math.abs(props.change)}</span>
                </div>
                <div className={`champ-img __spc32-${props.championID}`}/>
                    <div className="champ-desc">
                        <div>{props.name}</div>
                        <div>{props.position}</div>
                    </div>
            </div>
            <div className={classnames("win", {select: props.type === "winratio"})} hidden={props.type === 'banratio'}>{props.win}</div>
            <div className={classnames("pick", {select: props.type === "pickratio"})} hidden={props.type === 'banratio'}>{props.pick}</div>
            <div className={classnames("ban", {select: props.type === "banratio"})} hidden={props.type !== 'banratio'}>{props.ban}</div>
            <div className="tier" hidden={props.type !== 'tier'}>
                <img src={props.tier} alt="" />
            </div>
        </ChampionTrendItemWrapper>                
    )
}

export default ChampionTrendItem;