package com.ssafy.brAIn.stomp.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CurIndex {

    private int curIndex;

    public CurIndex(int curIndex) {
        this.curIndex = curIndex;
    }
}
