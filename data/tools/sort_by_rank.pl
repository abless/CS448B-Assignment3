#!/usr/bin/perl

open FIN, "<".$ARGV[0];

my %causeRank;

my $rank = 0;
while(<FIN>)
{
    chomp;
    @row = split / /;
    $causeRank{$row[0]} = $rank;
    $rank ++;
}

$line = <STDIN>;
print $line;

my @rows = ();

while(<STDIN>)
{
    chomp;
    @line = split(/,/, $_);
    push @rows, [@line];
}

@result = sort {$causeRank{$a->[1]} <=> $causeRank{$b->[1]} } @rows;

foreach ( @result)
{
    print $_->[0].",".$_->[1].",".$_->[2].",".$_->[3].",".$_->[4]."\n";
}
