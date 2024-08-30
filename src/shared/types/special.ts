import { Pagination } from './pagination';
import { ResponseMessage } from './responseMessage';
import { SpecialEntity } from 'src/specials';

export interface SpecialPagination extends Pagination {
  data: SpecialEntity[];
}

export interface FetchedSpecial extends ResponseMessage {
  data: SpecialEntity[];
}

export interface MessageWithSpecial extends ResponseMessage {
  data: SpecialEntity;
}