using SpacetimeDB;

public static partial class Module
{
    [SpacetimeDB.Table]
    public partial struct Tile
    {
        [SpacetimeDB.AutoInc]
        [SpacetimeDB.PrimaryKey]
        public int Id;
        public float Latitude;
        public float Longitude;
    }

    [SpacetimeDB.Reducer]
    public static void AddTile(ReducerContext ctx, float latitude, float longitude)
    {
        var tile = ctx.Db.Tile.Insert(new Tile { Latitude = latitude, Longitude = longitude });
        Log.Info($"Inserted tile at ({tile.Latitude}, {tile.Longitude}) as #{tile.Id}");
    }
}
