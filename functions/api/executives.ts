import { EMPLOYEES } from '../_employeeConfig';

export const onRequestGet = async () => {
  const publicList = EMPLOYEES.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email
  })).sort((a, b) => a.name.localeCompare(b.name));

  return new Response(JSON.stringify(publicList), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};
