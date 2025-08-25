using SpacetimeDB;

public static partial class Module
{
    [Table(Name = "tile", Public = true)]
    public partial struct TileInput
    {
        [PrimaryKey]
        [AutoInc]
        public int Id;
        public float Latitude;
        public float Longitude;
    }

    [Reducer]
    public static void AddTile(ReducerContext ctx, float latitude, float longitude)
    {
        var tile = ctx.Db.tile.Insert(new TileInput { Latitude = latitude, Longitude = longitude });

        Log.Info($"Inserted tile at ({tile.Latitude}, {tile.Longitude}) as #{tile.Id}");
    }
}
