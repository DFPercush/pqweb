
type Dim = [number, number, number, number, number, number];


export type Unit = 
{
	symbol: string;
	longNameSingular: string;
	longNamePlural: string;
	factor: number;
	dim:Dim;
	applySIPrefixes: boolean;
	iofs: number;
}

export type HistoryItem =
{
	query: string;
	output: string;
	error: string;
	warnings: string[];
};



type UnitList = {[name:string]:number};

function du(sym:string, lns:string, lnp:string, f:number, d:Dim, p:boolean = false, iofs: number = 0): Unit
{
	return {
		"symbol": sym,
		"longNameSingular": lns,
		"longNamePlural": lnp,
		"factor": f,
		"dim": d,
		"applySIPrefixes": p,
		"iofs": iofs
	};
}


const KnownUnitOffsets: number[] = 
[
	// Any unit with an additive offset must be at the beginning of KnownUnits[].
	0, // Kelvin, needs to come first for sprint() order and iofs conditions
	273.15, // degC
	255.37222222222222222222222222222,  // degF
	273.15, // degc
	255.37222222222222222222222222222  // degf
];

// TODO: Possible units: mpg?

export const Units: Unit[] = 
[
	// Kelvin must be first
	du("K","kelvin","kelvin",1.0, [0,0,0,1,0,0], true, 0),
	du("degC","degreeC","degreesC",1.0, [0,0,0,1,0,0], false, 1),
	du("degF","degreeF","degreesF",0.55555555555555555555555555555556, [0,0,0,1,0,0], false, 2),
	du("degc","degreeC","degreesC",1.0, [0,0,0,1,0,0], false, 3),
	du("degf","degreeF","degreesF",0.55555555555555555555555555555556, [0,0,0,1,0,0], false, 4),
	// ^ Don't mess with these, they need to be at the start of the array

	du("g", "gram","grams",0.001, [1,0,0,0,0,0], true),
	du("rd","radian","radians",1, [ 0, 0, 0, 0, 0,0], false),
	du("deg","degree","degrees",0.01745329251994329576923690768489, [0,0,0,0,0,0], false),
	du("grad","gradians","gradians", 0.0157079632679489661923132169164, [ 0, 0, 0, 0, 0,0], false),
	du("rev","revolution","revolutions",6.283185307179586476925286766559, [ 0, 0, 0, 0, 0,0], false),
	du("pi","pi","pi",3.1415926535897932384626433832795, [0,0,0,0,0,0], false ),
	du("tau","tau","tau",6.283185307179586476925286766559, [0,0,0,0,0,0], false ),
	du("e", "e", "e", 2.7182818284590452353602874713527, [0,0,0,0,0,0], false ),
	du("mol", "mole", "moles", 6.0221415e23, [0,0,0,0,0,0], true),
	du("amu", "atomic_mass_unit","atomic_mass_units",0.000000000000000000000000001660539, [1,0,0,0,0,0], false),
	du("carat", "carat","carats",0.0002, [1,0,0,0,0,0], false),
	du("dram", "dram","drams",0.001771845, [1,0,0,0,0,0], false),
	du("hundredweight", "hundredweight","hundredweights",45.35924, [1,0,0,0,0,0], false),
	du("longton", "longton","longtons",1016.05, [1,0,0,0,0,0], false),
	du("long_ton", "long_ton","long_tons",1016.05, [1,0,0,0,0,0], false),
	du("t", "metric_ton","metric_tons",1000, [1,0,0,0,0,0], false),
	du("oz", "ounce","ounces",0.02834952, [1,0,0,0,0,0], false),
	du("lbs_mass", "pound_mass","lbs_mass",0.4535924, [1,0,0,0,0,0], false),
	du("lb_mass", "pound_mass","pounds_mass",0.4535924, [1,0,0,0,0,0], false),
	du("lb", "pound","pounds",0.4535924, [1,0,0,0,0,0], false),
	du("lbs", "pound","pounds",0.4535924, [1,0,0,0,0,0], false),
	du("shortton", "shortton","shorttons",907.185, [1,0,0,0,0,0], false),
	du("short_ton", "short_ton","short_tons",907.185, [1,0,0,0,0,0], false),
	du("slug", "slug","slugs",14.5939, [1,0,0,0,0,0], false),
	du("stick", "stick","sticks",0.115, [1,0,0,0,0,0], false),
	du("stone", "stone","stones",6.350293, [1,0,0,0,0,0], false),
	du("tola", "tola","tolas",0.0116638, [1,0,0,0,0,0], false),
	du("ton", "ton","tons",907.1847, [1,0,0,0,0,0], false),
	du("ozt", "troy_ounce","troy_ounces",0.03110348, [1,0,0,0,0,0], false),
	du("dwt", "pennyweight","pennyweights",0.03110348/20, [1,0,0,0,0,0], false),
	du("grain", "grain","grains",0.00006479891, [1,0,0,0,0,0], false),
	du("lbt", "troy_pound","troy_pounds",0.03110348*12, [1,0,0,0,0,0], false),
	du("lbst", "troy_pound","troy_pounds",0.03110348*12, [1,0,0,0,0,0], false),
	du("kip", "kip","kips",453.59237, [1,0,0,0,0,0], false),
	du("klb", "klb","klbs",453.59237, [1,0,0,0,0,0], false),
	du("dalton", "dalton","daltons",1.66053E-27, [1,0,0,0,0,0], false),
	du("m", "meter","meters",1, [0,1,0,0,0,0], true),
	du("mi", "mile","miles",1609.3439999931,     [ 0, 1, 0, 0, 0,0], false),
	du("nmi","nautical_mile","nautical_miles",1852, [0,1,0,0,0,0], false),
	du("yd", "yard","yards",0.9144, [0,1,0,0,0,0], false),
	du("ft", "foot","feet",0.3048, [0,1,0,0,0,0], false),
	du("in", "inch","inches",0.0254, [0,1,0,0,0,0], false),
	du("ang","angstrom","angstroms",1e-10, [0,1,0,0,0,0]), // TODO: Unicode
	du("AU","astronomical_unit","astronomical_units", 149597900000, [0,1,0,0,0,0]),
	du("ly","lightyear","lightyears",9460732325561360, [0,1,0,0,0,0], true),
	du("ly","light_year","light_years",9460732325561360, [0,1,0,0,0,0], true),
	du("pc","parsec","parsecs",30856778900000000, [0,1,0,0,0,0], true),
	du("ls","lightsecond","lightseconds",299792458, [0,1,0,0,0,0]),
	du("ls","light_second","light_seconds",299792458, [0,1,0,0,0,0], ),
	du("mil","mil","mils",0.0000254, [0,1,0,0,0,0], false),
	du("thou","thou","thous",0.0000254, [0,1,0,0,0,0], false),
	du("chain","chain","chains",20.11680394008, [0,1,0,0,0,0], false),
	du("li","link","links",0.201168039400805, [0,1,0,0,0,0], false),
	du("rod","rod","rods", 5.0292105028246334, [0,1,0,0,0,0], false),
	du("ac", "acre","acres", 4046.86, [0,2,0,0,0,0], false),
	du("b", "barn","barns", 1e-28, [0,2,0,0,0,0]),
	du("a", "are","ares", 100, [0,2,0,0,0,0], false),
	du("ha", "hectare","hectares", 10000, [0,2,0,0,0,0], false),
	du("ro", "rood","roods", 1011.714, [0,2,0,0,0,0], false),
	du("L", "liter","liters", 0.001, [0,3,0,0,0,0], true),
	du("cc", "cubic_centimeter","cubic_centimeters", 0.000001, [0,3,0,0,0,0], false),
	du("gal", "gallon","gallons", .003785411784, [0,3,0,0,0,0], false),
	du("qt", "quart","quarts", 0.000946352946, [0,3,0,0,0,0], false),
	du("pt", "pint","pints", 0.000473176473, [0,3,0,0,0,0], false),
	du("cu", "cup","cups", 0.0002365882365, [0,3,0,0,0,0], false),
	du("floz", "fluid_ounce","fluid_ounces", 0.0000295735295625, [0,3,0,0,0,0], false),
	du("tbsp", "tablespoon","tablespoons", 0.00001478676478125, [0,3,0,0,0,0], false),
	du("tsp", "teaspoon","teaspoons", 0.00000492892159375, [0,3,0,0,0,0], false),
	du("beerbarrel", "beerbarrel","beerbarrels", .1173478, [0,3,0,0,0,0], false),
	du("drop", "drop","drops", 0.00000005, [0,3,0,0,0,0], false),
	du("fldram", "fluid_dram","fluid_drams", .000003696691, [0,3,0,0,0,0], false),
	du("gill", "gill","gills", .0001182941, [0,3,0,0,0,0], false),
	du("hogshead", "hogshead","hogsheads", .238481, [0,3,0,0,0,0], false),
	du("minim", "minim","minims", 0.00000006161152, [0,3,0,0,0,0], false),
	du("oilbarrell", "oilbarrel","oilbarrels", .1589873, [0,3,0,0,0,0], false),
	du("s", "second","seconds",1, [0,0,1,0,0,0], true),
	du("min", "minute","minutes",60, [0,0,1,0,0,0], false),
	du("hr", "hour","hours",3600, [0,0,1,0,0,0], false),
	du("h", "hour","hours",3600, [0,0,1,0,0,0], false),
	du("d", "day","days",3600*24, [0,0,1,0,0,0], false),
	du("w", "week","weeks",3600*24*7, [0,0,1,0,0,0], false),
	du("y", "year","years",3600*24*365.25, [0,0,1,0,0,0], false),
	du("Hz", "hertz","hertz",1, [0,0,-1,0,0,0], true),
	du( "rpm","revolution_per_minute","revolutions_per_minute",0.10471975511965977461542144610932, [ 0, 0, -1, 0, 0,0], false ),
	du("mph","mile_per_hour","miles_per_hour",1609.3439999931/3600.0, [0,1,-1,0,0,0], false),
	du("kt","knot","knots",0.51444444444444444444444444444444, [0,1,-1,0,0,0], false),
	du("kph","kilometer per hour","kilometers per hour",1000.0/3600, [0,1,-1,0,0,0], false),
	//du("g0","gee","gees",9.80665, [0,1,-2,0,0,0], false),
	du("J","joule","joules",1, [1,2,-2,0,0,0], true),
	du("Wh","watt_hour","watt_hours",3600, [1,2,-2,0,0,0], true),
	du("eV","electron_volt","electron_volts",1.602176634e-19, [1,2,-2,0,0,0], true),
	du("BTU","british_thermal_unit","british_thermal_units",1055.056, [1,2,-2,0,0,0]),
	du("btu","british_thermal_unit","british_thermal_units",1055.056, [1,2,-2,0,0,0]),
	du("erg","erg","ergs",0.0000001, [1,2,-2,0,0,0]),
	du("cal","calorie","calories",4.184, [1,2,-2,0,0,0], true),
	du("W", "watt", "watts", 1, [1,2,-3,0,0,0], true),
	du("hp_mech", "mechanical_horsepower","mechanical_horsepower", 745.699872, [1,2,-3,0,0,0]),
	du("hp", "horsepower","horsepower", 745.699872, [1,2,-3,0,0,0]),
	du("hp_electric", "electric_horsepower", "electric_horsepower", 746, [1,2,-3,0,0,0]),
	du("hp_metric", "metric_horsepower", "metric_horsepower", 735.49875, [1,2,-3,0,0,0]),
	du("N","newton","newtons",1, [1,1,-2,0,0,0], true),
	du("ozf","ounce_force","ounces_force",0.2780139, [1,1,-2,0,0,0], false),
	du("lbf","pound_force","pounds_force",4.448221615260501, [1,1,-2,0,0,0], false),
	du("t_force","metric_ton_force","metric_tons_force",9806.65, [1,1,-2,0,0,0], false),
	du("ton_force","ton_force","tons_force",1, [1,1,-2,0,0,0], false),
	du("dyn","dyne","dynes",0.00001, [1,1,-2,0,0,0]),
	du("gf","gram_force","grams_force",0.00980665, [1,1,-2,0,0,0]),
	du("kipf","kip_force","kips_force",4448.222, [1,1,-2,0,0,0], false),
	du("klbf","klb_force","klbs_force",4448.222, [1,1,-2,0,0,0], false),
	du("A","amp","amps",1, [0,0,0,0,1,0], true),
	du("A","ampere","amperes",1, [0,0,0,0,1,0], true),
	du("C","coulomb","coulombs",1, [0,0,1,0,1,0], true),
	du("e_p","fundamental_charge","fundamental_charges",1.6021765314e-19, [0,0,1,0,1,0], false ),
	du("e_p","positron","positrons",1.6021765314e-19, [0,0,1,0,1,0], false ),
	du("e_n","fundamental_charge_negative","fundamental_charges_negative",-1.6021765314e-19, [0,0,1,0,1,0], false ),
	du("e_n","electron","electrons",-1.6021765314e-19, [0,0,1,0,1,0], false ),
	du("V", "volt", "volts", 1, [1,2,-3,0,-1,0], true),
	du("ohm", "ohm", "ohms", 1, [1,2,-3,0,-2,0], true),
	du("S", "siemens", "siemens", 1, [-1,-2,3,0,2,0], true),
	du("F", "farad", "farads", 1, [-1,-2,4,0,2,0], true),
	du("Wb", "weber", "webers", 1, [1,2,-2,0,-1,0], true),
	du("T", "tesla", "teslas", 1, [1,0,-2,0,-1,0], true),
	du("gauss", "gauss", "gauss", .0001, [1,0,-2,0,-1,0], true),
	du("H", "henry", "henrys", 1, [1,2,-2,0,-2,0], true),
	du( "cpm", "count_per_minute", "counts_per_minute", 1.0 / 60.0, [0,0,-1,0,0,0] ),
	du( "Bq", "becquerel", "becquerels", 1, [0,0,-1,0,0,0], true ),
	du( "Rd", "rutherford", "rutherford", 1e6, [0,0,-1,0,0,0], true ),
	du( "Gy", "gray", "grays", 1, [0,2,-2,0,0,0], true ),
	du( "rad", "rad", "rads", 0.01, [0,2,-2,0,0,0], true ),
	du( "R", "roentgen", "roentgens",2.58e-4, [-1,0,1,0,1,0], true),
	du("Pa", "pascal","pascals", 1,[1,-1,-2,0,0,0], true),
	du("bar", "bar","bars", 100000,[1,-1,-2,0,0,0], true),
	du("psi", "pound_per_square_inch","pounds_per_square_inch", 6894.757293178,[1,-1,-2,0,0,0]),
	du("torr", "torr","torr", 133.3223684211,[1,-1,-2,0,0,0], true),
	du("mmHg", "millimeter_mercury","millimeters_mercury", 133.322,[1,-1,-2,0,0,0]),
	du("cmHg", "centimeter_mercury","centimeters_mercury", 1333.22,[1,-1,-2,0,0,0]),
	du("atm", "atmosphere","atmospheres", 101325,[1,-1,-2,0,0,0]),
	du("Ba", "bary","barye", 0.1,[1,-1,-2,0,0,0], true),
	du("pieze", "pieze","pieze", 1000,[1,-1,-2,0,0,0]),
	du("cmH2O", "centimeter_water","centimeters_water", 98.0665,[1,-1,-2,0,0,0]),
	du("mmH2O", "millimeter_water","millimeters_water", 9.80665,[1,-1,-2,0,0,0]),
	du("P", "poise","poise", 0.1,[1,-1,-1,0,0,0], true),
	du("St", "stokes","stokes", 1.0,[0,2,-1,0,0,0], true),
	du("Cd", "candela", "candelas", 1.0, [0,0,0,0,0,1], true),
	du("candlepower", "candlepower", "candlepower", 0.981, [0,0,0,0,0,1], false),
	du("lm", "lumen", "lumens", 1.0, [0,0,0,0,0,1], true),
	// TODO: ^ How to express sr or square radians?
	// It's technically a scalar, but making no distinction of that fact
	// from a cd feels kind of incomplete. Maybe we need that angle flag.

	//du("talbot", "talbot", "talbots", 1, [0,0,1,0,0,1], true),
	du("lx", "lux", "lux", 1.0, [0,-2,0,0,0,1], true),
	du("fc","foot-candle","feet-candles",10.7639, [0,-2,0,0,0,1],true),
	du("ph", "phot", "phots", 10000, [0,-2,0,0,0,1], false), // TODO: Exclude prefix "mph" and "kph"
	du("nx", "nox", "nox", 0.001, [0,-2,0,0,0,1], true),
	du("sb", "stilb", "stilbs", 10000, [0,-2,0,0,0,1], true),
	du("asb", "apostilb", "apostilbs", 0.318309886184, [0,-2,0,0,0,1], false),
	du("blondel", "blondel", "blondels", 1.0 / Math.PI, [0,-2,0,0,0,1], false),
	du("bril", "bril", "brils", 10e-7 / Math.PI, [0,-2,0,0,0,1], false),
	du("sk", "skot", "skots", 10e-3 / Math.PI, [0,-2,0,0,0,1], false),
	du("lambert", "lambert", "lamberts", 10e4 / Math.PI, [0,-2,0,0,0,1], false), // Note: L is already taken
	du("footlambert", "footlambert", "footlamberts", 3.42625909963, [0,-2,0,0,0,1], false),

];

const UnitMostComplexOrder: number[] =
	 Object.keys(Units)
	 .map((s:string):number=>parseInt(s))
	 .sort((a:number, b:number):number=>
{
	let ma = 0;
	let mb = 0;
	for (var i = 0; i < 6; i++)
	{
		ma += Math.abs(Units[a].dim[i]);
		mb += Math.abs(Units[b].dim[i]);
	}
	return mb - ma;  // descending order means b-a
});


let UnitMapNameToIndex: {[name:string]:number} = {};
for (var iUnit = 0; iUnit < Units.length; iUnit++)
{
	UnitMapNameToIndex[Units[iUnit].symbol] = iUnit;
	UnitMapNameToIndex[Units[iUnit].longNameSingular] = iUnit;
	UnitMapNameToIndex[Units[iUnit].longNamePlural] = iUnit;
}

type Prefix = 
{
	symbol: string;
	longName: string;
	factor: number;
};

function dp(s: string, n: string, f: number) : Prefix
{
	return {
		"symbol": s,
		"longName": n,
		"factor": f
	};
}

const Prefixes: Prefix[] =
[
	dp("" , ""     , 1     ),
	dp("k", "kilo" , 1e3   ),
	dp("m", "milli", 1e-3  ),
	dp("M", "mega" , 1e6   ),
	dp("u", "micro", 1e-6  ),  // Should I make the source files utf-8 for greek letters? Would require re-coding a lot to handle wchar_t... meh
	dp("G", "giga" , 1e9   ),
	dp("n", "nano" , 1e-9  ),
	dp("T", "tera" , 1e12  ),
	dp("p", "pico" , 1e-12 ),
	dp("P", "peta" , 1e15  ),
	dp("f", "femto", 1e-15 ),
	dp("E", "exa"  , 1e18  ),
	dp("a", "atto" , 1e-18 ),
	dp("z", "zepto", 1e-21 ),
	dp("Z", "zetta", 1e21  ),
	dp("y", "yocto", 1e-24 ),
	dp("Y", "yotta", 1e24  ),
	dp("c", "centi", 1e-2  ),
	dp("d", "deci" , 0.1   ),
	dp("da", "deka", 10.0  ),
	dp("h", "hecto", 100.0 ),
];


let AllUnitNames = {}
for (var iUnit = 0; iUnit < Units.length; iUnit++)
{
	let u = Units[iUnit];
	AllUnitNames[u.symbol] = true;
	AllUnitNames[u.longNameSingular] = true;
	AllUnitNames[u.longNamePlural] = true;
	if (u.applySIPrefixes)
	{
		for (var iPrefix = 0; iPrefix < Prefixes.length; iPrefix++)
		{
			let p = Prefixes[iPrefix];
			AllUnitNames[p.symbol + u.symbol] = true;
			AllUnitNames[p.longName + u.longNameSingular] = true;
			AllUnitNames[p.longName + u.longNamePlural] = true;
		}
	}
}


const forbiddenChars: string = "`~!@#$%&=[]{}\\;:\'\"<>?,";

let pqWarnings: string[] = [];

export class PQ
{
	public n: number = 0;
	public iofs:number = 0;
	//public dim: [number, number, number, number, number, number] = [0,0,0,0,0,0];
	public dim: Dim = [0,0,0,0,0,0];
	public extra: {[name: string]: number} = {};

	static readonly SoloChars : string = "()+-/*^";


	constructor(x: number, d: Dim, iofs: number = 0)
	{
		this.n = x;
		this.iofs = iofs;
		for (var i = 0; i < 6; i++)
		{
			this.dim[i] = d[i] || 0;
		}
	}

	static getWarnings(): string[]
	{
		let ret = pqWarnings;
		pqWarnings = [];
		return ret;
	}
	static warn(s: string): void
	{
		pqWarnings.push(s);
	}

	dimEq(b: PQ): boolean
	{
		for (var i = 0; i < 6; i++)
		{
			if (this.dim[i] != b.dim[i]) return false;
		}
		return true;
	}
	extraEq(b: PQ): boolean
	{
		for (var k in this.extra)
		{
			if (this.extra[k] != b.extra[k]) return false;
		}
		return true;
	}
	isScalar(): boolean
	{
		for (var i = 0; i < 6; i++)
		{
			if (this.dim[i] != 0) { return false; }
		}
		for (var k in this.extra)
		{
			if (this.extra[k] != 0) { return false; }
		}
		return true;
	}
	static one(): PQ
	{
		return new PQ(1, [0,0,0,0,0,0]);
	}
	static zero(): PQ
	{
		return new PQ(0, [0,0,0,0,0,0]);
	}
	
	clone(): PQ
	{
		let r = new PQ(this.n, this.dim);
		r.iofs = this.iofs;
		//r.n = a.n;
		//for (var i = 0; i < 6; i++) { r.dim[i] = a.dim[i]; }
		for (var k in this.extra) { r.extra[k] = this.extra[k]; }
		return r;
	}

	static fromSave(sv):PQ
	{
		let r = PQ.zero();
		r.n = sv.n;
		r.iofs = sv.iofs;
		for (var i = 0; i < 6; i++) { r.dim[i] = sv.dim[i]; }
		for (var k in sv.extra) { r.extra[k] = sv[k]; }
		return r;
	}

	magdim(): number
	{
		let m = 0;
		for (var i = 0; i < 6; i++) { m += Math.abs(this.dim[i]); }
		return m;
	}

	mul(b: PQ): PQ
	{
		let a = this;
		let r = PQ.zero();

		//console.log(`(${a.n} - ${KnownUnitOffsets[a.iofs]}) * (${b.n} - ${KnownUnitOffsets[b.iofs]})`);
		r.n = (a.n - KnownUnitOffsets[a.iofs]) * (b.n - KnownUnitOffsets[b.iofs]);
		if (a.isScalar())
		{
			//console.log(`${r.n} += ${KnownUnitOffsets[a.iofs]} + ${KnownUnitOffsets[b.iofs]};`);
			r.n += KnownUnitOffsets[b.iofs];
			r.iofs = b.iofs;
		}
		else if (b.isScalar())
		{
			r.n += KnownUnitOffsets[a.iofs];
			r.iofs = a.iofs;
		}
		else
		{
			r.iofs = 0;
		}

		for (var i = 0; i < 6; i++)
		{
			r.dim[i] = a.dim[i] + b.dim[i];
		}
		for (var ea in a.extra)
		{
			r.extra[ea] = a.extra[ea];
		}
		for (var eb in b.extra)
		{
			r.extra[eb] = (r.extra[eb] || 0) + b.extra[eb];
			if (feq(r.extra[eb], 0))
			{
				delete r.extra[eb];
			}
		}
		if (r.isScalar())
		{
			if (a.iofs != 0) { r.n -= KnownUnitOffsets[a.iofs]; }
			if (b.iofs != 0) { r.n -= KnownUnitOffsets[b.iofs]; }
		}
		return r;
	}

	div(b: PQ): PQ
	{
		let a = this;
		let r = PQ.zero();

		//if (a.isScalar() || b.isScalar()) { r.n = a.n / b.n; }
		//r.n = (a.n - KnownUnitOffsets[a.iofs]) / (b.n - KnownUnitOffsets[b.iofs]);
		r.n = (a.n - KnownUnitOffsets[a.iofs]) / (b.n - KnownUnitOffsets[b.iofs]);
		r.iofs = 0;
		//console.log(`div(): (${a.n} - ${KnownUnitOffsets[a.iofs]}) / (${b.n} - ${KnownUnitOffsets[b.iofs]}) ==> ${r.n}`);
		//if (a.isScalar() || b.isScalar()) { r.n += KnownUnitOffsets[a.iofs] + KnownUnitOffsets[b.iofs]; }
		//if (a.isScalar())
		//{
		//	//console.log(`${r.n} += ${KnownUnitOffsets[a.iofs]} + ${KnownUnitOffsets[b.iofs]};`);
		//	r.n += KnownUnitOffsets[b.iofs];
		//	r.iofs = b.iofs;
		//}
		//else if (b.isScalar())
		//{
		//	r.n += KnownUnitOffsets[a.iofs];
		//	r.iofs = a.iofs;
		//}
		//else if (arreq(a.dim, b.dim))
		////else if (KnownUnitOffsets[b.iofs] === 0)
		//{
		//	console.log("temp to temp");
		//	r.n += KnownUnitOffsets[a.iofs];
		//	r.n += KnownUnitOffsets[b.iofs];
		//	r.iofs = b.iofs;
		//}
		//else
		//{
		//	r.iofs = 0;
		//}



		for (var i = 0; i < 6; i++)
		{
			r.dim[i] = a.dim[i] - b.dim[i];
		}
		for (var ea in a.extra)
		{
			r.extra[ea] = a.extra[ea];
		}
		for (var eb in b.extra)
		{
			r.extra[eb] = (r.extra[eb] || 0) - b.extra[eb];
			if (feq(r.extra[eb], 0))
			{
				delete r.extra[eb];
			}
		}
		//if (r.magdim() == 0)
		//{
		//	if (a.iofs != 0) { r.n += KnownUnitOffsets[a.iofs]; }
		//	if (b.iofs != 0) { r.n -= KnownUnitOffsets[b.iofs]; }
		//}
		return r;
	}
	
	add(b: PQ): PQ
	{
		let a = this;
		if (!a.dimEq(b) || !a.extraEq(b))
		{
			throw new TypeError("Can not add values with different units.");
		}
		let r: PQ = this.clone();
		r.n = a.n + b.n - KnownUnitOffsets[b.iofs];
		return r;
	}
	
	sub(b: PQ): PQ
	{
		let a = this;
		if (!a.dimEq(b) || !a.extraEq(b))
		{
			throw new TypeError("Can not add values with different units.");
		}
		let r: PQ = this.clone();
		//console.log(`sub(): ${a.n} - (${b.n} - ${KnownUnitOffsets[b.iofs]})`);
		r.n = a.n - (b.n - KnownUnitOffsets[b.iofs]);
		return r;
	}

	pow(e: number): PQ
	{
		// TODO: What to do with offsets here?
		let a = this;
		//if ((e != Math.floor(e)) && (e != Math.ceil(e)) && (!a.isScalar()))
		//{
		//	throw new TypeError("Values with units can not be raised to non-integer powers.");
		//}
		let r = this.clone();
		r.n = Math.pow(a.n, e);
		for (var i = 0; i < 6; i++)
		{
			r.dim[i] = r.dim[i] * e;
			if (!feq(r.dim[i], Math.floor(r.dim[i])) && !feq(r.dim[i], Math.ceil(r.dim[i])))
			{
				throw new TypeError("Physical units can not have a non-integer exponent.");
			}
		}
		for (var k in r.extra)
		{
			r.extra[k] = r.extra[k] * e;
			if (!feq(r.extra[i], Math.floor(r.extra[i])) && !feq(r.extra[i], Math.ceil(r.extra[i])))
			{
				throw new TypeError("Physical units can not have a non-integer exponent.");
			}
		}
		return r;
	}

	bestPower(unit: PQ, prefer:boolean = false):number
	{
		let power: number = 0;
		let testdiv = this.div(unit);
		let md = 0;
		if ((testdiv.magdim() < this.magdim()) ||
			(prefer && (testdiv.magdim() <= this.magdim())))
		{
			do
			{
				md = testdiv.magdim();
				power++;
				testdiv = testdiv.div(unit);
			} while (testdiv.magdim() < md);
			return power;
		}
		
		let testmul = this.mul(unit);
		if ((testmul.magdim() < this.magdim()) ||
			(prefer && (testmul.magdim() <= this.magdim())))
		{
			do
			{
				md = testmul.magdim();
				power--;
				testmul = testmul.mul(unit);
			} while (testmul.magdim() < md);
			return power;
		}

		return 0;
	}

	static getPreferredName(p:Prefix, u:Unit, n:number):string
	{
		let pname: string;
		if (settings.useLongNames)
		{
			if (!p) { pname = ""; }
			else { pname = p.longName; }
			if (feq(n, 1))
			{
				return pname + u.longNameSingular;
			}
			else
			{
				return pname + u.longNamePlural;
			}
		}
		else
		{
			if (!!p) {pname = p.symbol;}
			else {pname = "";}
			return pname + u.symbol;
		}
	}



	
	prettyPrint(varset: PQVars = {}, preferredUnits: string = ""): string
	{
		let q = this.clone();
		let out: {[name: string]: number} = {};
		let sea: BestUnitSearch = new BestUnitSearch();
		
		let pu = preferredUnits.split(' ');
		let testpow = 0;
		let ipu = 0

		let onlyTemperature : boolean = arreq(q.dim, [0,0,0,1,0,0]);

		let mdpref: number;
		do
		{
			mdpref = q.magdim();
			sea.reset(q);
			for (var name of pu)
			{
				if (name !== "" && varset[name] !== undefined)
				{
					sea.tryNext(ipu, varset[name], name);
				}
				ipu++;
			}
			if (sea.isValidResult())
			{
				out[sea.bestUnitName] = sea.bestPow;
				if (onlyTemperature)
				{
					// This is so hacky, I hate it.
					// Alright, so PQ.n *is* the Kelvin representation, as long as it's a temperature^1 unit.
					// So all we have to do is convert to the right scale. Source offset doesn't matter.
					// From PQ.cpp:
					//	r.value = (r.value - rom(KnownUnitOffsets[pu[ipu].iUnit])) / rom(KnownUnits[pu[ipu].iUnit].factor);
					// translated
					var ofs = KnownUnitOffsets[sea.bestUnit.iofs];
					var factor = sea.bestUnit.n - ofs;
					q.n = (q.n - ofs) / factor;
					q.dim = [0,0,0,0,0,0];
				}
				else
				{
					q = q.div(sea.bestUnit.pow(sea.bestPow));
				}
			}
		} while (q.magdim() > 0 && q.magdim() < mdpref);

		while (q.magdim() > 0)
		{
			let unit: Unit;
			let u: PQ;
			let qtest: PQ;

			sea.reset(q);
			for (var iUnit = 0; iUnit < Units.length; iUnit++)
			{
				sea.tryNext(iUnit, varset[Units[iUnit].symbol], Units[iUnit].symbol);
			}

			if (!sea.isValidResult())
			{
				throw new Error("No units found. Possible data corruption. Reload.");
			}

			unit = Units[sea.iBestUnit];
			u = varset[unit.symbol];
			if (unit.applySIPrefixes)
			{
				//var ofs = KnownUnitOffsets[q.iofs];
				//var to_ofs = KnownUnitOffsets[sea.bestUnit.iofs];


				//qtest = q.div(u.pow(sea.bestPow));
				//if (onlyTemperature) { qtest.n += ofs - to_ofs; throw new Error("Not implemented"); }
				if (onlyTemperature)
				{
					var ofs = KnownUnitOffsets[unit.iofs];
					var factor = unit.factor; // sea.bestUnit.n - ofs;
					qtest = q.clone();
					qtest.n = (q.n - ofs) / factor;
					qtest.dim = [0,0,0,0,0,0];
				}
				else
				{
					qtest = q.div(u.pow(sea.bestPow));
				}


				let foundPrefix = false;
				for (var iPrefix = 0; iPrefix < Prefixes.length; iPrefix++)
				{
					let p = Prefixes[iPrefix];
					let npre = qtest.n / Math.pow(p.factor, sea.bestPow);
					if (npre >= 0.99 && npre < 1000.0)
					{
						q = qtest;
						q.n = npre;
						out[PQ.getPreferredName(p, unit, q.n)] = sea.bestPow;
						foundPrefix = true;
						break;
					}
				}
				if (!foundPrefix)
				{
					//q = q.div(u.pow(sea.bestPow));
					if (onlyTemperature)
					{
						var ofs = KnownUnitOffsets[unit.iofs];
						var factor = unit.factor; // sea.bestUnit.n - ofs;
						q.n = (q.n - ofs) / factor;
						q.dim = [0,0,0,0,0,0];
					}
					else
					{
						q = q.div(u.pow(sea.bestPow));
					}
	
					out[PQ.getPreferredName(null, unit, q.n)] = sea.bestPow;
				}
			}
			else
			{
				//var ofs = KnownUnitOffsets[q.iofs];
				//var to_ofs = KnownUnitOffsets[sea.bestUnit.iofs];
				//q = q.div(u.pow(sea.bestPow));
				//if (onlyTemperature) { q.n += ofs - to_ofs; throw new Error("Not implemented"); }
				if (onlyTemperature)
				{
					var ofs = KnownUnitOffsets[unit.iofs];
					var factor = unit.factor; // sea.bestUnit.n - ofs;
					q.n = (q.n - ofs) / factor;
					q.dim = [0,0,0,0,0,0];
				}
				else
				{
					q = q.div(u.pow(sea.bestPow));
				}

				out[PQ.getPreferredName(null, unit, q.n)] = sea.bestPow;
			} // apply prefixes
		}  // while magdim > 0

		// We have our units and powers.
		// Start building the result string
		let ret = TrimRightZeros(q.n.toPrecision(settings.precision || 6));
		let negativeCount = 0
		for (var k in out)
		{
			if (out[k] > 0 || settings.negexp)
			{
				ret += " ";
				ret += k;
				if (out[k] > 1)
				{
					ret += "^";
					ret += out[k].toString();
				}
			}
			else if (out[k] < 0) { negativeCount++; }
		}
		if ((negativeCount > 0) && (!settings.negexp))
		{
			ret += " / ";
			if (negativeCount > 1) { ret += "("; }
			for (var k in out)
			{
				if (out[k] < 0)
				{
					ret += " ";
					ret += k;
					if (out[k] < -1)
					{
						ret += "^";
						ret += (-out[k]).toString();
					}
				}
			}
			if (negativeCount > 1) { ret += ")"; }
		}
		return ret;
	}


	static parse(s:string, varset: PQVars): PQ
	{
		let ts: Token[] = [];
		let c = ' ';
		let pc = ' ';
		let curClass: CharClass = CharClass.WHITESPACE;
		let prevClass: CharClass = CharClass.WHITESPACE;
		let tokenBegin: number = 0;
		for (var i = 0; i < s.length; i++)
		{
			c = s[i];
			if (forbiddenChars.indexOf(c) !== -1)
			{
				throw new SyntaxError(`Invalid character ${c} at index ${i}`);
			}

			if (prevClass == CharClass.WHITESPACE) { tokenBegin = i; }

			if (isWhitespace(c)) // && prevClass != CharClass.WHITESPACE)
			{
				curClass = CharClass.WHITESPACE;
				//ts.push(new Token(prevClass, s, tokenBegin, i));
			}
			//else if (prevClass == CharClass.NUMBER && c == '.') { curClass = CharClass.NUMBER; }
			else if (c == '.') { curClass = CharClass.NUMBER; }
			else if (prevClass == CharClass.NUMBER && (c == 'e' || c == 'E'))
			{
				//console.log("eeeee!");
				curClass = CharClass.NUMBER;
			}
			else if (prevClass == CharClass.NUMBER && (pc == 'e' || pc == 'E') && (c == '+' || c == '-'))
			{
				//console.log("EEEEEE!");
				curClass = CharClass.NUMBER;
			}
			else if (prevClass == CharClass.SYMBOL && isAlphaNumeric(c)) { curClass = CharClass.SYMBOL; }
			else if (isNumeric(c)) { curClass = CharClass.NUMBER; }
			else if (isAlpha(c)) { curClass = CharClass.SYMBOL; }
			else if (c == '(') { curClass = CharClass.OPEN; }
			else if (c == ')') { curClass = CharClass.CLOSE; }
			else if (c == '+') { curClass = CharClass.ADD; }
			else if (c == '-') { curClass = CharClass.SUB; }
			else if (c == '*') { curClass = CharClass.MUL; }
			else if (c == '/') { curClass = CharClass.DIV; }
			else if (c == '^') { curClass = CharClass.EXP; }
			else { curClass = CharClass.UNKNOWN; }
			//while (i < s.length && isWhitespace(s[i])) { i++ }

			//console.log(i, tokenBegin, prevClass, pc, curClass, c);
			if (curClass != prevClass && prevClass != CharClass.WHITESPACE)
			{
				//console.log("pc = " + pc + "  ,  c = " + c);
				ts.push(new Token(prevClass, s, tokenBegin, i));
				tokenBegin = i;
			}
			else if (PQ.SoloChars.indexOf(c) != -1)
			{
				ts.push(new Token(curClass, s, i, i + 1))
				tokenBegin = i + 1;
				curClass = CharClass.WHITESPACE;
			}
			//if (curClass == CharClass.WHITESPACE) { tokenBegin = i; }

			pc = c;
			prevClass = curClass;
		}

		if (curClass != CharClass.WHITESPACE)
		{
			ts.push(new Token(curClass, s, tokenBegin, s.length));
			tokenBegin = s.length;
		}

		// DBG: PRINT TOKENS
		//console.log(sca(ts));


		// Now we have a token stream, ts.
		// First let's detect unary operators like signs of numbers
		const tspace : Token = new Token(CharClass.WHITESPACE, s, 0,0," ");
		for (var i = 0; i < ts.length - 1; i++)
		{
			var pt = (i > 0) ? ts[i-1] : tspace;
			if (ts[i].ty == CharClass.SUB && pt.ty != CharClass.SYMBOL && pt.ty != CharClass.NUMBER && pt.ty != CharClass.CLOSE &&
				(ts[i+1].ty == CharClass.NUMBER || ts[i+1].ty == CharClass.SYMBOL))
			{
				//if (ts[i+1].ty == CharClass.NUMBER) || ts[i+1].ty == CharClass.SYMBOL)
				var t0 = ts[i];
				var t1 = ts[i+1]
				//ts[i+1].text = "-" + ts[i+1].text;
				ts.splice(i, 2,
					new Token(CharClass.OPEN, s, t0.begin, t0.begin, "("),
					new Token(CharClass.NUMBER, s, t0.begin, t0.begin, "-1"),
					new Token(CharClass.MUL, s, t0.begin, t0.begin, "*"),
					t1,
					new Token(CharClass.CLOSE, s, t1.end, t1.end, ")")
				);
				i += 3;
			}
			else if (ts[i].ty == CharClass.ADD && pt.ty != CharClass.SYMBOL && pt.ty != CharClass.NUMBER && pt.ty != CharClass.CLOSE &&
				(ts[i+1].ty == CharClass.NUMBER || ts[i+1].ty == CharClass.SYMBOL))
			{
				ts.splice(i, 1);
				i--;
			}
		}

		//// Next handle implicit multiplication
		//for (var i = 1; i < ts.length; i++)
		//{
		//	if ((ts[i].ty == CharClass.NUMBER || ts[i].ty == CharClass.SYMBOL) &&
		//		//(ts[i-1].ty == CharClass.NUMBER || ts[i-1].ty == CharClass.SYMBOL))
		//		ts[i-1].ty != CharClass.ADD &&
		//		ts[i-1].ty != CharClass.SUB &&
		//		ts[i-1].ty != CharClass.MUL &&
		//		ts[i-1].ty != CharClass.DIV &&
		//		ts[i-1].ty != CharClass.EXP)
		//	{
		//		//ts.splice(i, 0, new Token(CharClass.MUL, s, ts[i].begin, ts[i].begin, "*"));
		//		let ti = ts[i];
		//		let tim1 = ts[i-1];
		//		ts.splice(i-1, 2, 
		//			new Token(CharClass.OPEN, s, tim1.begin, ti.end, "("),
		//			tim1,
		//			new Token(CharClass.MUL, s, ti.begin, ti.begin, "*"),
		//			ti,
		//			new Token(CharClass.CLOSE, s, ti.end, ti.end, ")")
		//			);
		//	}
		//}

		// DBG: PRINT TOKEN STREAM
		//console.log(sca(ts));


		let root: ASTNode =
		{
			ty: CharClass.ROOT,
			text: "",
			begin: 0,
			end: s.length,
			sub: ts.map(function (t:Token): ASTNode {
				return {
					ty: t.ty,
					text: t.text,
					begin: t.begin,
					end: t.end,
					sub: []
				}
			})
		};
		//console.log(" ==== TOKENS ====");
		//this.printAST(root);
		//console.log(" ==== END TOKENS ====");
		

		PQ.rdpParens(root);
		//console.log(" ===== PARENS =====");
		//this.printAST(root);
		//console.log(" ===== END PARENS =====");

		PQ.rdpBinaryOperator(root, [CharClass.EXP]);
		PQ.rdpImplicitMul(root);
		// Normally multiplication and division are the same priority,
		// but here, we have expressions like "1 km" which invoke an
		// implicit multiplication. Those must be treated as a single unit
		// before any divisions take place.
		//PQ.rdpBinaryOperator(root, [CharClass.MUL]);
		PQ.rdpBinaryOperator(root, [CharClass.MUL, CharClass.DIV]);
		PQ.rdpBinaryOperator(root, [CharClass.ADD, CharClass.SUB]);

		// TODO: Debug menu setting
		// DBG: PRINT AST
		//console.log(" ===== FINAL =====");
		//this.printAST(root);
		//console.log(" ===== END FINAL =====");

		let result = PQ.evalAST(root, varset);
		//console.log(result);
		return result;
	}

	static breaksImplicitMul(n:ASTNode): boolean
	{
		// convenience function for determining if this node is an operator that would break
		// implicit multiplication in expressions like 1 km^2 / h
		// Note that the exponent has already been tree-ified, so we treat EXP as part of
		// an implicit string of multiplied nodes.
		return (
		        (n.ty == CharClass.MUL) ||
		        (n.ty == CharClass.DIV) ||
		        (n.ty == CharClass.ADD) ||
		        (n.ty == CharClass.SUB)
				);
	}

	static rdpImplicitMul(n: ASTNode)
	{
		for (var i = 0; i < n.sub.length; i++)
		{
			this.rdpImplicitMul(n.sub[i]);
		}
		// If this node is a higher precedence operator, don't scan the subtokens,
		// because this is not a raw token stream any more, these are arguments
		// to that operator.
		if (n.ty == CharClass.EXP) { return; }

		let stringBegin = 0;
		let stringEnd = 0;
		for (var i = 0; i < n.sub.length; i++)
		{
			if (this.breaksImplicitMul(n.sub[i]))
			{
				stringEnd = i;
				if (stringEnd - stringBegin > 1)
				{
					let nim:ASTNode = {
						ty:CharClass.MUL,
						begin: n.sub[stringBegin].begin,
						end: n.sub[stringEnd - 1].end,
						text: "*",
						sub: n.sub.splice(stringBegin, stringEnd - stringBegin)
					};
					n.sub.splice(stringBegin, 0, nim);
					i = stringBegin;
					stringBegin++;
				}
				else
				{
					stringBegin = stringEnd + 1;
				}
			}
			//this.rdpImplicitMul(n.sub[i]);
			//if ((i > 0) &&
			//	(n.sub[i].ty == CharClass.SYMBOL || n.sub[i].ty == CharClass.NUMBER) &&
			//	n.sub[i-1].ty != CharClass.ADD &&
			//	n.sub[i-1].ty != CharClass.SUB &&
			//	n.sub[i-1].ty != CharClass.MUL &&
			//	n.sub[i-1].ty != CharClass.DIV &&
			//	n.sub[i-1].ty != CharClass.EXP)
			//{
			//	let nn:ASTNode = {
			//		ty: CharClass.MUL,
			//		begin: n.sub[i].begin,
			//		end: n.sub[i].begin,
			//		text: "*",
			//		sub: n.sub.splice(i-1, 2)
			//	};
			//	n.sub.splice(i-1, 0, nn);
			//	i--;
			//	this.rdpImplicitMul(nn.sub[1]);
			//}

		}
		stringEnd = n.sub.length;
		if (stringEnd - stringBegin > 1)
		{
			let nim:ASTNode = {
				ty:CharClass.MUL,
				begin: n.sub[stringBegin].begin,
				end: n.sub[stringEnd - 1].end,
				text: "*",
				sub: n.sub.splice(stringBegin, stringEnd - stringBegin)
			};
			n.sub.splice(stringBegin, 0, nim);
			//i = stringBegin;
			//stringBegin++;
		}

	}

	static evalAST(n:ASTNode, varset: PQVars): PQ
	{
		let i = 0;
		let r:PQ;
		switch(n.ty)
		{
			case CharClass.ROOT:
				if (n.sub.length > 1) { throw new SyntaxError("Root contains more than one node"); }
				if (n.sub.length == 0) { throw new SyntaxError("Root is empty"); }
				return this.evalAST(n.sub[0], varset);
			case CharClass.ADD:
				//return this.evalAST(n.sub[0], varset).add(this.evalAST(n.sub[1], varset));
				if (n.sub.length == 0) { throw new SyntaxError(`Too few operands to addition at index ${n.begin}`);}
				//r = PQ.zero();
				r = this.evalAST(n.sub[0], varset)
				 for (i = 1; i < n.sub.length; i++) { r = r.add(this.evalAST(n.sub[i], varset)); } return r;
				break;
			case CharClass.SUB:
				if (n.sub.length !== 2) { throw new SyntaxError(`Bad operand count for subtraction at index ${n.begin}`) }
				return this.evalAST(n.sub[0], varset).sub(this.evalAST(n.sub[1], varset));
				//r = PQ.zero(); for (i = 0; i < n.sub.length; i++) { r = r.sub(this.evalAST(n.sub[i], varset)); } return r;
				break;
			case CharClass.MUL:
				//return this.evalAST(n.sub[0], varset).mul(this.evalAST(n.sub[1], varset));
				r = PQ.one(); for (i = 0; i < n.sub.length; i++) { r = r.mul(this.evalAST(n.sub[i], varset)); } return r;
				break;
			case CharClass.DIV:
				if (n.sub.length !== 2) { throw new SyntaxError(`Bad operand count for division at index ${n.begin}`) }
				return this.evalAST(n.sub[0], varset).div(this.evalAST(n.sub[1], varset));
				//r = PQ.one(); for (i = 0; i < n.sub.length; i++) { r = r.div(this.evalAST(n.sub[i], varset)); } return r;
				break;
			case CharClass.EXP:
				if (n.sub.length != 2) { throw new SyntaxError(`Bad operand count for exponent at index ${n.begin}`); }
				var s = this.evalAST(n.sub[1], varset);
				if (!s.isScalar()) { throw new SyntaxError(`Exponent can not contain units, at index ${n.begin}`); }
				return this.evalAST(n.sub[0], varset).pow(s.n);
				break;
			case CharClass.PAREN:
				if (n.sub.length != 1) { throw new SyntaxError(`Ill formed expression in parens at index ${n.begin}`); }
				return this.evalAST(n.sub[0], varset);
				break;
			case CharClass.NUMBER:
				return new PQ(parseFloat(n.text), [0,0,0,0,0,0]);
				break;
			case CharClass.SYMBOL:
				var v = varset[n.text];
				if (v === undefined) { throw new EvalError(`Unit or variable not defined: ${n.text}`); }
				return v;
				break;
			case CharClass.OPEN:
			case CharClass.CLOSE:
				throw new Error("Bug: open/close tokens should not appear in the AST");
				break;
			case CharClass.WHITESPACE:
				throw new Error("Bug: Whitespace tokens should not appear in the AST")
				break;
			case CharClass.UNKNOWN:
			default:
				throw new SyntaxError(`Unknown symbol at index ${n.begin}: ${n.text}`);
				break;
		}
	}

	static printAST(n: ASTNode, level = 0): void
	{
		console.log(PQ.spaces(level) + n.text + " ("+ n.ty.toString() + ")");
		//if (n.sub.length > 0) { this.printAST(n.sub[0], level + 1); }
		//if (n.sub.length > 1) { this.printAST(n.sub[1], level + 1); }
		////else if (n.sub.length > 0) { console.log(PQ.spaces(level+1) + "...?"); }
		//for (var i = 2; i < n.sub.length; i++)
		for (var i = 0; i < n.sub.length; i++)
		{
			//console.log(PQ.spaces(level + 1) + "...");
			this.printAST(n.sub[i], level + 1);
		}
	}

	static spaces(level:number): string
	{
		let line = "";
		for (var i = 0; i < level; i++) { line += "    "; }
		return line;
	}

	static rdpBinaryOperator(n: ASTNode, ops: CharClass[]): void
	{
		for (var i = 0; i < n.sub.length; i++)
		{
			//if (n.sub[i].sub.length > 0)
			{
				this.rdpBinaryOperator(n.sub[i], ops);
			}
			//if (ops.indexOf(n.sub[i].ty) != -1)
			if (n.sub[i].sub.length == 0 && ops.indexOf(n.sub[i].ty) != -1)
			{
				if (i == 0 || i == n.sub.length - 1)
				{
					//console.log(" ==== DEBUG PRINT ===== ");
					//this.printAST(n);
					//console.log(" ===== END DEBUG PRINT ===== ");
					throw new SyntaxError(`Binary operator ${n.sub[i].text} missing operand at index ${n.sub[i].begin}`);
				}

				let tLeft = n.sub[i-1];
				let tOp = n.sub[i];
				let tRight = n.sub[i+1];
				tOp.sub = [tLeft, tRight];
				//n.sub.splice(i - 1, 3, tOp);
				n.sub.splice(i + 1, 1);
				n.sub.splice(i - 1, 1);
				i--;
				this.rdpBinaryOperator(tRight, ops);
			}
		}
	}

	static rdpParens(n: ASTNode): void
	{
		let level = 0;
		let pbegin = 0;
		let pparen = 0
		let pend = 0;
		for (var i = 0; i < n.sub.length; i++)
		{
			if (n.sub[i].ty == CharClass.OPEN)
			{
				if (level == 0)
				{
					//console.log("open");
					pparen = i;
					pbegin = i + 1;
				}
				level++;
			}
			else if (n.sub[i].ty == CharClass.CLOSE)
			{
				level--;
				if (level == 0)
				{
					//console.log("close");
					pend = i;
					n.sub[pparen].ty = CharClass.PAREN;
					//n.sub[pparen].sub = n.sub.splice(pbegin, pend - pbegin);
					n.sub[pparen].sub = n.sub.splice(pbegin, pend - pbegin);
					n.sub.splice(pparen+1, 1);
					i = pparen;
				}
				else if (level < 0)
				{
					throw new SyntaxError(`Mismatched close parens at index ${i}`);
				}
			}
			
			
			if (n.sub[i].sub.length > 0)
			{
				this.rdpParens(n.sub[i]);
			}
		}
		if (level > 0) { throw new SyntaxError(`Unclosed parens at index ${pparen}`); }
	}
	
};

// recursive descent parser


class Token
{
	public ty: CharClass;
	public text: string;
	public begin: number;
	public end: number;
	constructor(cls:CharClass, source: string, iBegin: number, iEnd: number, textOverride: string = "")
	{
		this.ty = cls;
		if (textOverride.length > 0) { this.text = textOverride; }
		else { this.text = source.substring(iBegin, iEnd); }
		this.begin = iBegin;
		this.end = iEnd;
		//console.log("create token ", this.text);
	}
	toString(): string
	{
		return this.ty.toString + "('" + this.text + "')";
	}
};

export type PQVars = {[name: string]: PQ};

export function LoadVars(): PQVars
{
	let r: PQVars = {} //{order:[], vars:{}};

	let sv:PQVars;
	let svJson: string = "";
	try {
		svJson = window.localStorage.getItem("saved-vars");
		sv = JSON.parse(svJson) as PQVars;
	}
	catch
	{
		console.warn(`Failed to parse saved vars: ${svJson}` )
		sv = {};
	}

	for (var k in sv)
	{
		if (!AllUnitNames[k])
		{
			r[k] = PQ.fromSave(sv[k]);
		}
	}
	let nStored = Object.keys(r).length;

	for (var u of Units)
	{
		r[u.symbol] = new PQ(u.factor + KnownUnitOffsets[u.iofs], (u.dim), u.iofs);
		r[u.longNameSingular] = new PQ(u.factor + KnownUnitOffsets[u.iofs], (u.dim), u.iofs);
		r[u.longNamePlural] = new PQ(u.factor + KnownUnitOffsets[u.iofs], (u.dim), u.iofs);
		if (u.applySIPrefixes)
		{
			for (var p of Prefixes)
			{
				// Not going to worry about offsets here because Kelvin is the only one with SI prefixes
				r[p.symbol + u.symbol] = new PQ(u.factor * p.factor, u.dim, u.iofs);
				r[p.longName + u.longNameSingular] = new PQ(u.factor * p.factor, u.dim, u.iofs);
				r[p.longName + u.longNamePlural] = new PQ(u.factor * p.factor, u.dim, u.iofs);
			}
		}
	}
	//console.log(`Loaded ${nStored} vars and ${Object.keys(r).length - nStored} built-in units.`);
	console.log(`Loaded ${nStored} variables, ${Units.length} units, and ${Prefixes.length} prefixes.`);
	//r.order = Object.keys(r.vars).sort((a: string, b:string): number => r.vars[b].magdim() - r.vars[a].magdim());
	//console.log(`Still have ${Object.keys(r.vars).length} vars and units`);
	return r;
}


const InverseOrderOfOperations: string[][] =
[
	['+','-'],
	['*', '/'],
	['^'],
	['(', ')']
];

type ASTNode = 
{
	ty: CharClass;
	text: string;
	begin: number;
	end: number;
	sub: ASTNode[];
};

//const reAlphaNumeric = /^[0-9a-zA-Z]+$/;
//const reAlpha = /^[a-zA-Z]+$/;
const cc0 = '0'.charCodeAt(0);
const cc9 = '9'.charCodeAt(0);
const ccA = 'A'.charCodeAt(0);
const ccZ = 'Z'.charCodeAt(0);
const cca = 'a'.charCodeAt(0);
const ccz = 'z'.charCodeAt(0);

export function isWhitespace(s:string): boolean
{
	for (var i = 0; i < s.length; i++)
	{
		var c = s[i];
		if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {}
		else { return false; }
	}
	return true;
}

export function isAlpha(s:string):boolean
{
	for (var i = 0; i < s.length; i++)
	{
		var cc = s.charCodeAt(i);
		if(cc >= ccA && cc <= ccZ) continue;
		if (cc >= cca && cc <= ccz) continue;
		if (cc == '_'.charCodeAt(0)) continue;
		if (cc > 127) continue;
		return false;
	}
	return true;
}

export function isAlphaNumeric(s:string):boolean
{
	for (var i = 0; i < s.length; i++)
	{
		var cc = s.charCodeAt(i);
		if(cc >= ccA && cc <= ccZ) continue;
		if (cc >= cca && cc <= ccz) continue;
		if (cc >= cc0 && cc <= cc9) continue;
		if (cc == '_'.charCodeAt(0)) continue;
		if (cc > 127) continue;
		return false;
	}
	return true;
}
enum CharClass
{
	UNKNOWN = 0,
	WHITESPACE = 1,
	SYMBOL,
	NUMBER,
	OPERATOR,
	ADD,
	SUB,
	MUL,
	DIV,
	EXP,OPEN,
	CLOSE,
	PAREN,
	ROOT
};

export function isNumeric(s:string): boolean
{
	for (var i = 0; i < s.length; i++)
	{
		var cc = s.charCodeAt(i);
		if (cc >= cc0 && cc <= cc9) {}
		else { return false; }
	}
	return true;
}

//function sca(a: Array<any>): any[]
function sca<T>(a:T[]):T[]
{
	return [...a];
	//let r = []
	//for (var i = 0; i < a.length; i++)
	//{
	//	r[i] = a[i];
	//}
	//return r;
}

function sco<T extends object>(obj:T):T
{
	return {...obj};
	//let r:T = {};
	//for (var k in obj)
	//{
	//	r[k] = obj[k];
	//}
	//return r;
}

function feq(a: number, b:number, tolerance: number = 0.0001): boolean
{
	if (a != 0 && b != 0) { tolerance = Math.abs(tolerance * Math.min(a,b)); }
	return (Math.abs(a - b) < tolerance);
}

// Lowest is best
function rankAnswer(ans: {[name:string]:number}, varset:PQVars): number
{
	let r = 0;
	for (var k in ans)
	{
		r += 100;
		r += varset[k].magdim();
	}
	return r;
}

function bestConversion(qty: PQ, v:PQVars):UnitList
{
	let r:UnitList = {};
	let found = false;
	let bestRank = 999999;
	//let bestSub:UnitList = {};
	//let bestUnit:Unit;
	let bestAnswer: UnitList = {};
	//let bestPow = 0;
	let q = qty.clone();
	for (var unit of Units)
	{
		if (q.magdim() == 0) { break; }
		let uname = unit.symbol;
		let uq = v[uname];
		if (!uq) { uname = unit.longNameSingular; uq = v[uname]; }
		if (!uq) { uname = unit.longNamePlural; uq = v[uname]; }
		if (!uq) { continue; }
		let testPow = q.bestPower(uq, false);
		if (testPow != 0)
		{
			let test = q.div(uq.pow(testPow));
			let sub = bestConversion(test, v);
			let testAnswer = {};
			testAnswer[uname] = testPow;
			testAnswer = {...testAnswer, ...sub}
			let testRank = rankAnswer(testAnswer, v);
			if (testRank < bestRank)
			{
				bestRank = testRank;
				bestAnswer = testAnswer;
			}
		}
	}
	return bestAnswer;
}

export function SaveVars(varset: PQVars)
{
	let v:PQVars = {};
	for (var k in varset)
	{
		if (!AllUnitNames[k]) { v[k] = varset[k]; }
	}
	localStorage.setItem("saved-vars", JSON.stringify(v));
}

export function IsBuiltInUnit(name:string):boolean
{
	return AllUnitNames[name];
}

export function GetUnitFromSymbol(symbol:string): Unit
{
	for (var i = 0; i < Units.length; i++)
	{
		if (Units[i].symbol === symbol) { return Units[i]; } //.longNameSingular}
	}
	return undefined;
}

export function TrimRightZeros(s:string)
{
	s = s.trim();

	if (s.indexOf(".") == -1 || s.indexOf("e") != -1 || s.indexOf("E") != -1)
	{
		return s;
	}

	let iz = s.length;
	do
	{
		iz--;
	} while (s[iz] == '0');
	if (s[iz] == '.') {iz--;}
	return s.substring(0, iz + 1);
}


export class BestUnitSearch
{
	iBestUnit = -1;
	bestUnit: PQ;
	bestUnitName: string;
	bestPow = 0;
	bestMagdimDiff = 0;
	q: PQ;

	reset(currentValue: PQ)
	{
		this.init();
		this.q = currentValue;
	}

	init()
	{
		this.iBestUnit = -1;
		this.bestMagdimDiff = 0;
		this.bestUnit = null;
		this.bestUnitName = "";
		this.bestPow = 0;
		this.q = null;
	}

	constructor()
	{
		this.init();
	}

	isValidResult() : boolean
	{
		return this.iBestUnit !== -1;
	}

	tryNext(index: number, testUnit: PQ, unitName:string)
	{
		if (this.q.magdim() == 0) { return; }
		let testpow = this.q.bestPower(testUnit);
		if (testpow == 0) { return; }
		var all_leq = true;
		for (var iDim = 0; iDim < 6; iDim++)
		{
			// Not only must the magdim be less, but we don't want any of the
			// dimensions to increase, even if the overall result is less complex.
			//if (Math.abs(this.q.dim[iDim]) < Math.abs(this.q.dim[iDim]) - Math.abs((testUnit.dim[iDim]*testpow)))
			if (Math.abs(this.q.dim[iDim]) < Math.abs(this.q.dim[iDim] - (testUnit.dim[iDim]*testpow)))
			{
				all_leq = false;
				break;
			}
		}
		if (all_leq)
		{
			let qtest = this.q.div(testUnit.pow(testpow));
			var mdd = this.q.magdim() - qtest.magdim();
			if (mdd > this.bestMagdimDiff)
			{
				this.iBestUnit = index;
				this.bestUnit = testUnit;
				this.bestUnitName = unitName;
				this.bestPow = testpow;
				this.bestMagdimDiff = mdd;
			}
		}
	} // next()
};

function arreq<T>(a:T[], b:T[]): boolean
{
	if (a.length !== b.length) { return false; }
	for (var i = 0; i < a.length; i++)
	{
		if (a[i] !== b[i]) return false;
	}
	return true;
}


class Settings
{
	public precision:number;
	public useLongNames:boolean;
	public prefUnits: string;
	public negexp: boolean;
	constructor()
	{
		this.reload();
	}
	reload()
	{
		var s:any = JSON.parse(localStorage.getItem("settings"));
		if (!s) { s = {}; }
		this.precision = s.precision || 6;
		this.useLongNames = s.useLongNames || false;
		this.prefUnits = s.prefUnits || "";
		this.negexp = s.negexp || false;
	}
	save()
	{
		var savestr = JSON.stringify(this);
		localStorage.setItem("settings", savestr);
		console.log(savestr);
	}
};

export let settings:Settings = new Settings();

