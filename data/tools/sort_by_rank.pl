#!/usr/bin/perl

open FIN, "<".$ARGV[0];

my %causeRank;

my $rank = 0;
while(<FIN>)
{
    chomp;
    @row = split /;/;
    $causeRank{$row[0]} = $rank;
    $rank ++;
}

$line = <STDIN>;
print $line;

my @rows = ();

while(<STDIN>)
{
    chomp;
    #@line = split(/,/, $_);
    #push @rows, [@line];
    if ($_ =~ /(.+),(".+"),([12]),(.+),([0-9]+)/)
    {
        push @rows, [$1, $2, $3, $4, $5];
    }
}

sub mycmp
{
    if ($causeRank{$a->[1]} != $causeRank{$b->[1]})
    {
        return $causeRank{$a->[1]} - $causeRank{$b->[1]};
    }
    if ($a->[0] != $b->[0])
    {
        return $a->[0] - $b->[0];
    }
    if ($a->[2] != $b->[2])
    {
        return $a->[2] - $b->[2];
    }
    $a->[3] =~ /([0-9]+)/;
    $n1 = $1;
    $b->[3] =~ /([0-9]+)/;
    $n2 = $1;
    return $n1 - $n2;
}
#@result = sort {$causeRank{$a->[1]} <=> $causeRank{$b->[1]} } @rows;
@result = sort mycmp @rows;

foreach ( @result)
{
    print $_->[0].",".$_->[1].",".$_->[2].",".$_->[3].",".$_->[4]."\n";
}
