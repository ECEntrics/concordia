// https://github.com/orbitdb/orbit-db/blob/master/GUIDE.md#address
export async function determineDBAddress({orbit, dbName, type, identityId}) {
    const ipfsMultihash = (await orbit.determineAddress(dbName, type, {
        accessController: { write: [identityId] },
    })).root;
    return `/orbitdb/${ipfsMultihash}/${dbName}`;
}




