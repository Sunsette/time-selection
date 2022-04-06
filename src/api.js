export function getDeliveryDates() {
  return fetch("https://api.mathem.io/mh-test-assignment/delivery/dates").then(
    (res) => res.json()
  );
}

export function getDeliveryTimes(date) {
  return fetch(
    `https://api.mathem.io/mh-test-assignment/delivery/times/${date}`
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res;
    });
}
