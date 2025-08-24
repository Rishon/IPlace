using SpacetimeDB;

public static partial class Module
{
    [Table]
    public partial class Tile
    {
        [AutoInc]
        [PrimaryKey]
        public int Id;
        public float Latitude;
        public float Longitude;
    }

    [Reducer]
    public static void AddTile(ReducerContext ctx, float latitude, float longitude)
    {
        var tile = ctx.Db.Tile.Insert(new Tile { Latitude = latitude, Longitude = longitude });
        Log.Info($"Inserted tile at ({tile.Latitude}, {tile.Longitude}) as #{tile.Id}");
    }
}
