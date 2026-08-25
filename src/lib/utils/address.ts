import type { AddressParams } from "@spree/sdk";

export interface AddressFormData {
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  city: string;
  postal_code: string;
  phone: string;
  company: string;
  country_iso: string;
  state_abbr: string;
  state_name: string;
}

export const emptyAddress: AddressFormData = {
  first_name: "",
  last_name: "",
  address1: "",
  address2: "",
  city: "",
  postal_code: "",
  phone: "",
  company: "",
  country_iso: "",
  state_abbr: "",
  state_name: "",
};

export function addressToFormData(
  address?: {
    first_name: string | null;
    last_name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    postal_code: string | null;
    phone: string | null;
    company: string | null;
    country_iso: string;
    state_abbr: string | null;
    state_name: string | null;
  } | null,
): AddressFormData {
  if (!address) return { ...emptyAddress };
  return {
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    address1: address.address1 || "",
    address2: address.address2 || "",
    city: address.city || "",
    postal_code: address.postal_code || "",
    phone: address.phone || "",
    company: address.company || "",
    country_iso: address.country_iso || "",
    state_abbr: address.state_abbr || "",
    state_name: address.state_name || "",
  };
}

export function formDataToAddress(data: AddressFormData): AddressParams {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    address1: data.address1,
    address2: data.address2 || undefined,
    city: data.city,
    postal_code: data.postal_code,
    phone: data.phone || undefined,
    company: data.company || undefined,
    country_iso: data.country_iso,
    state_abbr: data.state_abbr || undefined,
    state_name: data.state_name || undefined,
  };
}

/**
 * Returns an updated address with the given field changed.
 * Clears state fields when country changes.
 */
export function updateAddressField(
  address: AddressFormData,
  field: keyof AddressFormData,
  value: string,
): AddressFormData {
  const updated = { ...address, [field]: value };
  if (field === "country_iso") {
    updated.state_abbr = "";
    updated.state_name = "";
  }
  return updated;
}

/**
 * E-mail réellement transmis à Spree pour la commande.
 *
 * Le champ e-mail est facultatif au paiement, mais Spree l'exige dès que la
 * commande est finalisée (`Spree::Order#require_email`). Quand le client n'en
 * donne pas, on en dérive un depuis son numéro de téléphone : sans cela la
 * commande échouerait à la dernière étape, sans message compréhensible.
 *
 * Le domaine utilisé est celui de la boutique, afin que ces adresses soient
 * captées par le routage e-mail du domaine plutôt que de générer des rebonds,
 * qui dégraderaient la réputation d'expédition.
 */
export function resolveOrderEmail(email: string, phone: string): string {
  const saisi = email.trim();
  if (saisi) return saisi;

  const chiffres = phone.replace(/\D/g, "");
  if (!chiffres) return "";

  let domaine = "example.invalid";
  try {
    const brut = process.env.NEXT_PUBLIC_SITE_URL;
    if (brut) domaine = new URL(brut).hostname;
  } catch {
    // domaine de repli conservé
  }
  return `tel-${chiffres}@${domaine}`;
}
