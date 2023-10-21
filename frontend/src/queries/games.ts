export const checkForGames = () => {
  console.log('checkForGames hit');
  fetch('http://localhost:8008/check-for-games')
    .then(async (response: Response) => {
      // console.log('response', response);
      // console.log('response.text()', await response.text());
      return response.text();
    })
    .then((data) => {
      console.log('games response data', data);
    });
};
