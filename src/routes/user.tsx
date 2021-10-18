import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar';
import queryString from 'query-string';
import fetch from '../utils/fetcher';
import useSWR from 'swr';
import { Player } from '../entities/PlayerData';
import BeatLoader from 'react-spinners/BeatLoader';
import Error from '../components/error';
import ArrowPagination from '../components/arrow-pagination';
import RankingPlayerItem from '../components/rankings/player-item';
import ReactPaginate from 'react-paginate';
import { useHistory, useLocation } from 'react-router-dom';

export default function User() {

    const { data: playerData, error: playerDataError } = useSWR<Player>(`/api/player/${}`), fetch);
}
