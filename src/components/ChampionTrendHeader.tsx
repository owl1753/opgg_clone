import React from "react";
import styled, { css } from "styled-components";

export const ChampionTrendItemCss = css`
    display: flex;
    align-items: center;

    & > div{
        text-align: center;
    }  
`

const ChampionTrendHeader = styled.div`
    ${ChampionTrendItemCss};

    padding: 15px;
    & > div{
        flex: 1;

        font-size: 12px;
        &:nth-child(1){
            flex: 0.5;
            text-align: center;
            order: -1;
        }

        &:nth-child(2){
           flex: 3;
           order: -1;
        }
    }   

    & > .select{
        order: -1;
    }
`

export default ChampionTrendHeader