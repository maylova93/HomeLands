import { useParams } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import { PropertyDetails } from "../../components/PropertyDetails/PropertyDetails";

export const PropertyPage = () => {
  const { propertyId } = useParams(); // Henter ID fra URL'en
  const { data, error, isLoading } = useGet(`https://api.mediehuset.net/homelands/homes/${propertyId}`);

  if (isLoading) return <p>Indlæser bolig...</p>;
  if (error) return <p>Fejl ved hentning: {error.toString()}</p>;
  if (!data || !data.item) return <p>Ingen bolig fundet.</p>;

  return <PropertyDetails home={data.item} />;
};
