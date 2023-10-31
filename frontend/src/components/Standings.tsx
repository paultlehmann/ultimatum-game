import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { getAllOffers } from '../queries/offers';
import { IGameRow, IGameState, IStandingsRow, SetState } from '../types';

interface IProps {
  gameId: number;
  setCheckedForGames: SetState<boolean>;
  setGameQueryResult: SetState<IGameRow | null>;
  setGameState: SetState<IGameState>;
  userName?: string;
}

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const Standings = (props: IProps) => {
  const {
    gameId,
    setCheckedForGames,
    setGameQueryResult,
    setGameState,
    userName
  } = props;

  const [results, setResults] = useState<IStandingsRow[]>([]);

  useEffect(() => getAllOffers(setResults, gameId), []);

  return !_.isEmpty(results) ? (
    <>
      <h1>Final Standings</h1>
      <TableContainer style={{ maxWidth: '80vw' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Rank
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Name
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Winnings
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Offers Accepted
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Offers Rejected
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Accepted Offers Made
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Rejected Offers Made
              </TableCell>
              <TableCell
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  textDecoration: 'underline'
                }}
              >
                Average Offer
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result: IStandingsRow, index: number) => {
              return (
                <TableRow key={`standings-row-${index + 1}`}>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {result.username}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {dollarFormatter.format(result.winnings)}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {result.offersIAccepted}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {result.offersIRejected}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {result.myOffersAccepted}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {result.myOffersRejected}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: 'center',
                      fontWeight:
                        result.username === userName ? 'bold' : 'normal'
                    }}
                  >
                    {dollarFormatter.format((result.averageOffer * 100) / 100)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant={'contained'}
        onClick={() => {
          setGameQueryResult(null);
          setCheckedForGames(false);
          setGameState({
            admin: 0,
            id: 0,
            round: 0,
            stage: 'pre'
          });
        }}
        style={{ marginTop: '50px' }}
      >
        Leave Game
      </Button>
    </>
  ) : null;
};

export default Standings;
