"""Week 4 assignment: fetch Pikachu data from PokéAPI using requests."""

import requests

# PokéAPI URL / purpose: asks the service for structured data about the Pokémon named "pikachu".
# PokéAPI returns: a JSON document (name, stats, abilities, sprites, nested "types", etc.).
POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/pikachu"


def main():
    try:
        response = requests.get(POKEAPI_URL, timeout=30)  # send HTTPS GET; JSON comes back in the body
        response.raise_for_status()  # if status is not OK, raise so we hit the except block
    except requests.exceptions.RequestException as error:
        print("Something went wrong while contacting PokéAPI.")  # friendly message for users / graders
        print(f"Details: {error}")  # include the underlying reason (timeout, 404, DNS, …)
        return

    pokemon = response.json()  # convert JSON text into a Python dict we can index by key

    # Fields extracted (why): name / height / weight describe the creature; type explains strengths/weaknesses.
    types_list = pokemon.get("types", [])  # list of slots; each slot wraps a nested "type" object with "name"
    primary_type_name = None
    if types_list:
        first_slot = types_list[0]  # use first slot as the primary typing shown in-game
        type_info = first_slot.get("type", {})  # nested dict where the actual type label lives
        # extracted field 4 (nested): elemental type—helps explain battle matchups for this Pokémon
        primary_type_name = type_info.get("name")  # e.g. "electric" for Pikachu

    name = pokemon.get("name")  # extracted field 1: species label from the API
    height = pokemon.get("height")  # extracted field 2: height in decimeters (API’s unit)
    weight = pokemon.get("weight")  # extracted field 3: weight in hectograms (API’s unit)

    # --- Print results in a readable layout ---
    print("PokéAPI — Pikachu")
    print("-------------------")
    print(f"Name:          {name}")
    print(f"Height:        {height} (decimeters)")
    print(f"Weight:        {weight} (hectograms)")
    print(f"Primary type:  {primary_type_name}")


if __name__ == "__main__":
    main()
