import { SliderEntity } from "src/slider/entities/slider.entity";
import { Pagination } from "./pagination";
import { ResponseMessage } from "./responseMessage";

export interface SliderPagination extends Pagination{
    data: SliderEntity[];
}

export interface FetchedSlider extends ResponseMessage{
    data: SliderEntity[];
}

export interface MessageWithSlider extends ResponseMessage{
    data: SliderEntity
}